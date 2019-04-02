<template>

<footer class="l-footer">
    <div class="l-footer__company">
    <small>&copy; 2019 BlockBase Co.,Ltd.</small>
        <div>
        <a href="https://block-base.co/" target="_blank">{{$t('footer.company')}}</a>｜
        <nuxt-link :to="$t('footer.termsHD')">{{$t('footer.terms')}}</nuxt-link>｜
        <nuxt-link :to="$t('footer.infoHD')">{{$t('footer.info')}}</nuxt-link>｜
        <a href="https://twitter.com/bazaaario" target="_blank">{{$t('footer.contact')}}</a>
        </div>
    </div>
</footer>
</template>

<script>
</script>

<style>

</style>
