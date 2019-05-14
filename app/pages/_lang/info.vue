<template>
<div>
  <div class="display-1 text-md-center pa-3">{{$t("info.title")}}</div>
  <info></info>
</div>

</template>

<script>
import info from '~/components/info'

export default {
  components: {
    info
  }
}
</script>
