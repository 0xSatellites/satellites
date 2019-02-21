<template>
    <div>
        <div class="common_header maintenance_header maintenance">
            <p><i class="fas fa-wrench fa-2x"></i>{{ $t('maintenance.title1') }}</p>
            <p><i class="fas fa-wrench fa-2x"></i>{{ $t('maintenance.title2') }}</p>
        </div>
        <div class="common_bar maintenance_bar">
            <!-- <p>メンテナンス日時 2019年1月29日 3:00~7:00</p> -->
        </div>
        <div class="common_description maintenance">
            <p>{{ $t('maintenance.description') }}</p>
        </div>
    </div>
</template>

<script>
export default {
    layout: 'maintenance',
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
