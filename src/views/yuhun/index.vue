<template>
    <n-spin :show="loading" description="加载数据中">
        <n-upload
            action="https://www.mocky.io/v2/5e4bafc63100007100d8b70f"
            :default-upload="false"
            accept=".json"
            @change="onUpload"
            :show-file-list="false"
            :file-list="fileList"
            :max="1"
        >
            <n-button>选择御魂数据</n-button>
        </n-upload>
        <span>{{ filename }}</span>
        <h3 class="text-center font-bold">一速总览</h3>
        <div id="chart1" class="w-full h-96"></div>
        <n-collapse default-expanded-names="1">
            <n-collapse-item title="总览" name="1">
                <n-grid x-gap="12" :cols="6">
                    <n-gi v-for="(arr, pos) in speedYuhunMap" class="">
                        <n-scrollbar style="max-height: 60vh">
                            <span class="text-[#8a2be2]">{{ pos }}号位 {{ arr.length }}个</span>
                            <n-tooltip v-for="s in arr.sort((a: any, b: any) => b - a)" :width="400">
                                {{ s }}
                                <template #trigger>
                                    <p>
                                        {{ s.Speed }}
                                    </p>
                                </template>
                            </n-tooltip>
                        </n-scrollbar>
                    </n-gi>
                </n-grid>
            </n-collapse-item>
        </n-collapse>
    </n-spin>
</template>

<script lang="ts" setup>
import { ExportYuhunData, Yuhun, YuhunPro } from '@/types/yuhun'
import { UploadFileInfo } from 'naive-ui'
import { Ref, computed, onMounted, ref } from 'vue'
import * as echarts from 'echarts'
import { IndexDBCache } from '@/utils/indexedDB'
import { yuhunNameMap } from './constant'
import { requireImg, stringToRGB } from '@/utils'
import { watch } from 'vue'

const fileList = ref<UploadFileInfo[]>([])
const filename = ref('')
const data = ref<ExportYuhunData>()
let yuhun: Ref<YuhunPro[]> = ref([])

const speedYuhunMap = computed<Record<string, YuhunPro[]>>(() => {
    const _mapObj = {}
    yuhun.value.forEach((y) => {
        const isWithSubSpeed = y.sub_attrs.includes('Speed')
        if (y.level === 15 && isWithSubSpeed && y.Speed && y?.Speed >= 15) {
            if (!_mapObj[y.pos]) _mapObj[y.pos] = []
            _mapObj[y.pos].push(y)
        }
    })
    return _mapObj
})

const loading = ref(false)

const chart1: any = ref()
/** @type EChartsOption */
const chartOption1: Ref<echarts.EChartsOption> = ref({
    grid: {
        top: '25%',
    },
    xAxis: { name: 'position' },
    yAxis: [
        {
            type: 'value',
            name: 'speed',
            min: 15,
            alignTicks: true,
            axisLine: {},
        },
    ],
    tooltip: {},
    toolbox: {
        bottom: 0,
        feature: {
            dataView: {},
            dataZoom: {},
            // echarts-disable-next-line
            myHideAllLegend: {
                show: true,
                title: '切换图例',
                icon: 'path://M592.160385 32.7862a24.756926 24.756926 0 0 0-35.061161 0L284.23775 305.647674 152.825309 173.96759a24.756926 24.756926 0 1 0-35.06116 35.328803l143.054887 143.188709a33.053842 33.053842 0 0 0 46.837428 0L592.160385 67.84736a24.756926 24.756926 0 0 0 0-35.06116zM441.611509 240.878202a37.469942 37.469942 0 0 0-17.53058 31.71563v76.679561A49.915316 49.915316 0 0 1 374.700897 399.590173H124.856673a49.915316 49.915316 0 0 1-49.915316-49.915317V124.855201A49.915316 49.915316 0 0 1 124.856673 74.939885H374.700897a49.513853 49.513853 0 0 1 19.67172 4.014637 33.053842 33.053842 0 0 0 34.927339-5.352849 33.187663 33.187663 0 0 0-5.219027-53.52849A148.541558 148.541558 0 0 0 349.676328 0H149.881242A149.87977 149.87977 0 0 0 0.001472 149.87977v174.770518a149.87977 149.87977 0 0 0 149.87977 149.87977h199.795086a149.87977 149.87977 0 0 0 149.87977-149.87977V272.995295A37.469942 37.469942 0 0 0 441.611509 240.878202z m-92.470465 307.788813H149.881242A149.87977 149.87977 0 0 0 0.001472 699.215891v174.904339a149.87977 149.87977 0 0 0 149.87977 149.87977h199.795086a149.87977 149.87977 0 0 0 149.87977-149.87977V699.215891a149.87977 149.87977 0 0 0-149.87977-149.745949z m74.939885 349.541035a49.915316 49.915316 0 0 1-49.380032 50.852065H124.856673a49.915316 49.915316 0 0 1-49.915316-50.049137V674.325144a49.915316 49.915316 0 0 1 49.915316-49.915317H374.700897a49.915316 49.915316 0 0 1 49.915316 49.915317zM1098.941357 74.939885H624.4113a25.024569 25.024569 0 0 0-25.024569 25.024569v24.890747a25.024569 25.024569 0 0 0 25.024569 25.024569h474.530057A25.024569 25.024569 0 0 0 1124.099747 124.855201V99.964454a25.024569 25.024569 0 0 0-25.15839-25.024569z m0 774.155776H624.4113a25.024569 25.024569 0 0 0-25.024569 25.024569v24.890748A25.024569 25.024569 0 0 0 624.4113 923.36644h474.530057A25.024569 25.024569 0 0 0 1124.099747 899.010978v-24.890748a25.024569 25.024569 0 0 0-25.15839-25.024569z m0-524.445373H624.4113a25.024569 25.024569 0 0 0-25.024569 25.024568V374.699425a24.890748 24.890748 0 0 0 25.024569 24.890748h474.530057A24.890748 24.890748 0 0 0 1124.099747 374.699425v-25.024569a25.024569 25.024569 0 0 0-25.15839-25.024568z m0 274.734971H624.4113a25.024569 25.024569 0 0 0-25.024569 25.024568v24.890748a25.024569 25.024569 0 0 0 25.024569 25.024569h474.530057A25.024569 25.024569 0 0 0 1124.099747 649.300575v-24.890748a24.890748 24.890748 0 0 0-25.15839-25.024568z',
                onclick: function (e) {
                    const { option } = e
                    const { series } = option || []
                    const legendNames = series.map((s) => s.name)
                    const allSelected = {}
                    const allUnSelected = {}
                    /**
                     * ? 这里legendNames不能用array.map等方法,虽然继承链上有array
                     */
                    for (let i = 0; i < legendNames.length; i++) {
                        const name = legendNames[i]
                        allSelected[name] = true
                        allUnSelected[name] = false
                    }
                    const { selected } = chartOption1.value.legend as any
                    if (!selected) {
                        ;(chartOption1.value.legend as any).selected = allUnSelected
                        return
                    }
                    const selectedValues = Object.keys(selected).map((k) => selected[k])
                    selectedValues.some((s) => Boolean(s))
                        ? ((chartOption1.value.legend as any).selected = allUnSelected)
                        : ((chartOption1.value.legend as any).selected = allSelected)
                },
            },
        },
    },
    legend: {
        // left:20%,
        right: 20,
        type: '',
        itemWidth: 20,
        itemHeight: 20,
        // selectedMode: 'multiple',
    },
    series: [],
})
watch(
    chartOption1,
    (newVal) => {
        // console.log('newVal', newVal, chart1.value)
        chart1.value.setOption(chartOption1.value)
    },
    { deep: true }
)

// 根据项目实际需求，设置对应数据库名、表名和数据库主键（主键需要为添加对象内的key，否则新增和获取会失败）

let yysDB = new IndexDBCache({
    dbName: 'yys',
    cacheTableName: 'yysTableCache',
    keyPath: 'id',
    indexes: [
        // { name: 'main_attr', unique: true },
        // { name: 'sub_attrs', unique: true },
        { name: 'id', unique: true },
    ],
})
const initIndexDB = async () => {
    return yysDB
        .initDB()
        .then((res: any) => {
            if (res.type == 'upgradeneeded') {
                console.log('indexDB 数据库创建或更新成功!')
            } else {
                console.log('indexDB 数据库初始化成功!')
            }
        })
        .catch((err) => {
            console.log('indexDB 数据库初始化失败! ', err)
        })
}
await initIndexDB()

const onUpload = async (options: { fileList: UploadFileInfo[] }) => {
    loading.value = true
    const file = options.fileList[0]
    filename.value = file.name
    const reader = new FileReader() //实例化一个FileReader对象
    reader.readAsText(file.file as any, 'gbk') //借助 FileReader 的方法，按照文本格式读入文件，第二个参数是编码方式（可空）
    reader.onload = async function () {
        const result = this.result
        if (!result) window.$message.error('请选择御魂导出器导出的数据文件')
        data.value = JSON.parse(result as string)
        const originData = data.value?.equip_data || []
        const _yuhun: any = originData.map((item) => {
            const { base_attr, rand_attr, suit_id, ..._newItem } = item
            const newItem: Partial<YuhunPro> = _newItem
            for (const key in base_attr) {
                newItem[key] = base_attr[key]
                newItem.main_attr = key as any
            }
            for (const key in rand_attr) {
                newItem[key] = rand_attr[key]
            }
            newItem.suit_name = yuhunNameMap[suit_id]
            newItem.sub_attrs = Object.keys(rand_attr).join('|')
            // 补充suit_id用于判断图片路径
            newItem.suit_id = suit_id
            return newItem
        })
        // console.log('yuhun', _yuhun)
        for (const y of _yuhun) {
            await yysDB.addData(y, 'put')
        }
        console.log(`添加御魂${yuhun.value.length}条`)
        yuhun.value = _yuhun
        window.$message.success(`添加御魂${yuhun.value.length}条`)
    }
    loading.value = false
}

onMounted(async () => {
    // 初始化数据
    try {
        //@ts-ignore
        yuhun.value = await yysDB.getDataByKey()

        // const res = await getDataByKey(idb,'yys','yuhun')
        window.$message.success(`读取${yuhun.value.length}条数据`)
    } catch (e) {
        console.log('获取数据失败', e)
    }
    // 表格配置
    const chartData1: Record<string, [number, number][]> = {}
    for (const y of yuhun.value) {
        const isWithSubSpeed = y.sub_attrs.includes('Speed')
        if (y.level === 15 && isWithSubSpeed && y.Speed && y?.Speed >= 15) {
            if (!chartData1[y.suit_id]) chartData1[y.suit_id] = []
            chartData1[y.suit_id].push([y.pos, y.Speed])
        }
    }
    const series: echarts.SeriesOption[] = []
    for (let key in chartData1) {
        series.push({
            symbolSize: 12,
            data: chartData1[key],
            type: 'scatter',
            // color: stringToRGB(key),
            name: yuhunNameMap[key],
            symbol: `image://${requireImg(`${key}.png`)}`,
        })
    }
    chartOption1.value.series = series

    // 初始化表格
    const elChart1 = document.querySelector('#chart1')
    let _chart1
    if (elChart1) {
        _chart1 = echarts.init(elChart1 as HTMLElement)

        _chart1.setOption(chartOption1.value)
        // _chart1.value.off('click')
        // 解决重复触发
        chart1.value = _chart1
    }
    _chart1.off('legendselectchanged')

    // 切换图例选中状态后的事件
    _chart1.on('legendselectchanged', function ({ selected }) {
        ;(chartOption1.value.legend as any).selected = selected
    })
    window.addEventListener('resize', function () {
        _chart1 && _chart1.resize() // myChart 是实例对象
    })
})
</script>

<style scoped></style>
