const fs = require('node:fs')
const path = require('node:path')
const Module = require('node:module')
const root = path.resolve(__dirname, '../..')
const runtime = process.env.REFERRAL_TEST_DEPS || __dirname
const dependencies = Module.createRequire(path.resolve(runtime, 'package.json'))
const ts = dependencies('typescript')
const compiler = dependencies('vue-template-compiler')
const output = process.env.REFERRAL_BROWSER_BUNDLE || path.resolve(runtime, 'referral-browser.js')
;(async () => {
  const result = await Bun.build({
    entrypoints: [path.join(__dirname, 'browser-entry.ts')],
    target: 'browser',
    plugins: [{ name: 'actual-legacy-vue-source', setup(build) {
      build.onResolve({ filter: /^~\// }, args => ({ path: path.join(root, 'templates', `${args.path.slice(2)}.js`) }))
      build.onResolve({ filter: /^(vue|vuex|vue-router|vuetify|bignumber\.js|vue-property-decorator|vue-class-component)$/ }, args => ({
        path: dependencies.resolve(args.path === 'vue' ? 'vue/dist/vue.esm.js' : args.path)
      }))
      build.onLoad({ filter: /\.vue$/ }, args => {
        const parts = compiler.parseComponent(fs.readFileSync(args.path, 'utf8'))
        const template = compiler.compile(parts.template.content)
        if (template.errors.length) throw new Error(template.errors.join('\n'))
        const script = ts.transpileModule(parts.script.content, { compilerOptions: {
          target: ts.ScriptTarget.ES2018, module: ts.ModuleKind.ES2015, experimentalDecorators: true
        } }).outputText.replace('export default', 'const component =')
        return { loader: 'js', contents: `${script}\ncomponent.options.render = new Function(${JSON.stringify(template.render)});\ncomponent.options.staticRenderFns = ${JSON.stringify(template.staticRenderFns)}.map(body => new Function(body));\nexport default component;` }
      })
    } }]
  })
  if (!result.success) throw new Error(result.logs.map(String).join('\n'))
  await Bun.write(output, result.outputs[0])
  console.log(output)
})().catch(error => { console.error(error); process.exitCode = 1 })
