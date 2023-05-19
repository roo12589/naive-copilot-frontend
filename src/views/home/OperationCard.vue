<template>
    <div
        class="cursor-pointer my-2 flex border border-[rgb(239,239,245)] rounded-lg p-6 transition-all hover:shadow-md"
    >
        <div class="w-2/4 h-full px-2 box-border flex flex-col justify-start items-start whitespace-pre-line text-left">
            <p class="m-0 font-bold text-[18px]">{{ operation.content.doc.title }}</p>
            <div>
                <n-tag type="default" size="medium">
                    <b>{{ operation.content.stage_name }}</b>
                </n-tag>
            </div>
            {{ operation.content.doc.details }}
        </div>
        <div class="w-2/4 h-full px-2 box-border flex flex-col">
            <div class="flex flex-col items-end h-20">
                <div class="flex justify-center items-center">
                    <!-- <n-icon><StarSharp /></n-icon> -->
                    {{ getRateText(operation.rating_level / 2) }}
                    <n-rate allow-half :default-value="operation.rating_level / 2" readonly size="small" />
                    &nbsp;&nbsp;
                    <n-icon><EyeOutline /></n-icon>
                    {{ operation.views }}&nbsp;&nbsp;
                    <n-icon><TimeOutline /></n-icon>
                    <n-time :time="new Date(operation.upload_time).getTime()" :to="Date.now()" type="relative" />
                </div>
                <div class="flex justify-center items-center">
                    <n-icon><PersonCircleOutline /></n-icon>
                    {{ operation.uploader }}
                </div>
            </div>
            <div class="flex flex-col justify-start items-start">
                <b>干员/干员组</b>
                <div class="w-full flex justify-start flex-wrap">
                    <n-tag class="m-1" type="default" size="medium" v-for="operator in operation.content.opers">
                        op skill{{ operator.skill }}
                    </n-tag>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { Operation } from '@/types'
import { EyeOutline, TimeOutline, PersonCircleOutline } from '@vicons/ionicons5'

defineProps<{ operation: Operation }>()

function getRateText(score: number) {
    if (score <= 0) return '🙄没人评价'
    if (score > 0 && score <= 1.5) return '😒看看别的'
    if (score > 1.5 && score <= 3.5) return '🤨有风险的'
    if (score > 3.5 && score <= 4.0) return '☺️可以抄的'
    if (score >= 4.5) return '😍几乎完美'
}
</script>