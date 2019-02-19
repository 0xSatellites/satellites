<template>
    <div>
        <div class="common_header pnf_header pnf">
            <p><i class="fas fa-exclamation-triangle fa-2x"></i>お探しのページが見つかりませんでした。</p>
        </div>
        <div class="common_bar pnf_bar">
            <p>404 Page not found</p>
        </div>
        <div class="common_description pnf">
            <p>URLが間違っているか、ページが削除された可能性があります。ご不便をおかけいたしますが、URLをご確認いただくか、<a href="/">bazaaarトップページ</a>から再度お探しください。</p>
        </div>
    </div>
</template>

<script>
export default {

}
</script>

<style scoped>
/* 共通 */
.common_header{
    padding: 100px 200px 10px 150px;
    /* position: absolute; */
}

.common_bar{
    color: #FFF;
    height: 100px;
    width: 100%;
    /* position: absolute; */
    top: calc(50% - 50px);
    display: flex;
    align-items: center;
}

.common_bar p{
    font-size: 30px;
    padding-left: 150px;
}

.common_description{
    /* position: absolute; */
    padding-top: 20px;
    top: calc(50% + 60px);
    padding-left: 150px;
    padding-right: 150px;
}

/* メンテナンスページ */
.maintenance_header{
    top: calc(50% - 310px);
}

.maintenance_header p{
    font-size: 60px;
    color: #113249;
}

.maintenance_bar{
    background-color: #3498DB;
}


.maintenance{
    color:#113249;
}

/* 404errorページ */

.pnf_header{
    top: calc(50% - 240px);
}

.pnf_header p{
    font-size: 40px;
}

.pnf p{
    color: #431212;
}

.pnf_bar{
    background-color: #F94646;
}

@media (max-width: 767px) {
    .common_header{
        padding:30px
    }

    .common_bar p{
        font-size: 20px;
        padding-left: 30px;
    }

    .maintenance_header{
        top: calc(50% - 160px);
    }

    .maintenance_header p{
        font-size: 30px;
    }

    .pnf_header p{
        font-size: 30px;
    }

    .common_description{
        padding-top: 20px;
        top: calc(50% + 60px);
        padding-left: 30px;
        padding-right: 30px;
    }

}

</style>
