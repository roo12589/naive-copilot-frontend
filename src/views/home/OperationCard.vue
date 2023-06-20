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
            <RenderArticle :details="operation.content.doc.details || ''" />
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
import { OperationCombined as Operation } from '@/models/operation'
import { useArknightsStore } from '@/store/arknights'
import { useSettingStore } from '@/store/setting'
import { EyeOutline, TimeOutline, PersonCircleOutline } from '@vicons/ionicons5'
import { computed } from 'vue'
import { RenderArticle } from './render'

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

function getRateText(score: number) {
    if (score <= 0) return '🙄没人评价'
    if (score > 0 && score <= 1.5) return '😒看看别的'
    if (score > 1.5 && score <= 3.5) return '🤨有风险的'
    if (score > 3.5 && score <= 4.0) return '☺️可以抄的'
    if (score >= 4.5) return '😍几乎完美'
}
</script>
