<template>
    <div
        class="cursor-pointer my-2 flex border border-solid border-[rgb(239,239,245)] rounded-lg p-6 transition-all hover:shadow-md"
    >
        <div class="w-2/4 h-full px-2 box-border flex flex-col justify-start items-start whitespace-pre-line text-left">
            <p class="m-0 font-bold text-[18px]"><docTitle /></p>
            <n-space align="center">
                <n-tag type="default" size="medium">
                    <b>{{ level?.catThree || operation.content.stageName }}</b>
                    {{ level?.catOne }}
                </n-tag>
                <n-tag type="default" size="small">{{ level?.name }}</n-tag>
            </n-space>
            <article v-html="renderArticle(operation.content.doc.details || '')" />
        </div>
        <div class="w-2/4 h-full px-2 box-border flex flex-col">
            <div class="flex flex-col items-end h-20">
                <div class="flex justify-center items-center">
                    <!-- <n-icon><StarSharp /></n-icon> -->
                    {{ getRateText(operation.ratingLevel / 2) }}
                    <n-rate allow-half :default-value="operation.ratingLevel / 2" readonly size="small" />
                    &nbsp;&nbsp;
                    <n-icon><EyeOutline /></n-icon>
                    {{ operation.views }}&nbsp;&nbsp;
                    <n-icon><TimeOutline /></n-icon>
                    <n-time :time="new Date(operation.uploadTime).getTime()" :to="Date.now()" type="relative" />
                </div>
                <div class="flex justify-center items-center">
                    <n-icon><PersonCircleOutline /></n-icon>
                    {{ operation.uploader }}
                </div>
            </div>
            <div class="flex flex-col justify-start items-start">
                <!-- <div class="w-full flex justify-start flex-wrap"> -->
                <p class="m-0"><b>干员</b></p>
                <div class="w-full flex flex-wrap">
                    <n-tag
                        class="m-1 flex flex-col justify-center items-center"
                        v-for="operator in operation.content.opers"
                    >
                        {{ operator.name }} {{ operator.skill }}
                    </n-tag>
                </div>
                <div v-for="group in operation.content.groups">
                    <p class="m-0">
                        <b>{{ group.name }}</b>
                    </p>
                    <div class="w-full flex flex-wrap">
                        <n-tag class="m-1 flex flex-col justify-center items-center" v-for="operator in group.opers">
                            {{ operator.name }} {{ operator.skill }}
                        </n-tag>
                    </div>
                </div>
                <!-- </div> -->
            </div>
        </div>
    </div>
</template>

<script lang="tsx" setup>
import { useReplaceComponent } from '@/hooks/useReplaceComponent'
import { OPERATORS } from '@/models/generated/operators'
import { OperationCombined as Operation } from '@/models/operation'
import { useArknightsStore } from '@/store/arknights'
import { useSettingStore } from '@/store/setting'
import { EyeOutline, TimeOutline, PersonCircleOutline } from '@vicons/ionicons5'
import { computed } from 'vue'

const { operation } = defineProps<{ operation: Operation }>()

const arknightsStore = useArknightsStore()

const level = computed(() => arknightsStore.levels.find((level) => level.stageId === operation.content.stageName))

const settingStore = useSettingStore()
const docTitle = () => {
    const t = operation.content.doc.title
    const rules = settingStore.getRules('title')
    if (!rules) return <>{t}</>
    const replaced = useReplaceComponent(t, rules)
    return <>{replaced}</>
}

const renderArticle = (details: string) => {
    const biliHttpReg =
        /https?:\/\/(?:www\.)?bilibili\.com\/video\/([AaBb][Vv][a-zA-Z0-9]+)([\w\-\.,@?^=%&:\/~\+#]*[\w\-\@?^=%&\/~\+#])?/gi
    const BVReg = /[AaBb][Vv][a-zA-Z0-9]+/gi
    const imgHttpReg =
        /((ht|f)tps?):\/\/[\w\-]+(\.[\w\-]+)+([\w\-\.,@?^=%&:\/~\+#]*[\w\-\@?^=%&\/~\+#])?\.(png|jpg|jpeg|gif)/gi
    const httpReg = /((ht|f)tps?):\/\/[\w\-]+(\.(?!bilibili)[\w\-]+)+([\w\-\.,@?^=%&:\/~\+#]*[\w\-\@?^=%&\/~\+#])?/gi
    let res = details

    if (biliHttpReg.test(res)) {
        res = res.replace(biliHttpReg, `<a href="$&" onclick="event.stopPropagation()">$1</a>`)
    } else if (BVReg.test(res)) {
        res = res.replace(BVReg, `<a href="https://www.bilibili.com/video/$&" onclick="event.stopPropagation()">$&</a>`)
    }
    if (imgHttpReg.test(res)) {
        res = res.replace(
            imgHttpReg,
            `<a href="$&" onclick="event.stopPropagation()"><img style="width:100%;" src="$&" alt="如图片加载失败，请尝试点击前往" /></a>`
        )
    } else if (httpReg.test(res)) {
        res = res.replace(httpReg, `<a href="$&" onclick="event.stopPropagation()">$&</a>`)
    }
    return res
}

function getRateText(score: number) {
    if (score <= 0) return '🙄没人评价'
    if (score > 0 && score <= 1.5) return '😒看看别的'
    if (score > 1.5 && score <= 3.5) return '🤨有风险的'
    if (score > 3.5 && score <= 4.0) return '☺️可以抄的'
    if (score >= 4.5) return '😍几乎完美'
}
</script>
