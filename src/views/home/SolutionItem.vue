<template>
    <div class="solution-info">
        <div class="left">
            <p class="title">{{ solution.content.doc.title }}</p>
            <div>
                <n-tag type="default" size="medium">
                    <b>{{ solution.content.stage_name }}</b>
                </n-tag>
            </div>
            {{ solution.content.doc.details }}
        </div>
        <div class="right">
            <div class="top">
                <div class="flex-center">
                    <!-- <n-icon><StarSharp /></n-icon> -->
                    {{ getRateText(solution.rating_level / 2) }}
                    <n-rate allow-half :default-value="solution.rating_level / 2" readonly size="small" />
                    &nbsp;&nbsp;
                    <n-icon><EyeOutline /></n-icon>
                    {{ solution.views }}&nbsp;&nbsp;
                    <n-icon><TimeOutline /></n-icon>
                    <n-time :time="new Date(solution.upload_time).getTime()" :to="Date.now()" type="relative" />
                </div>
                <div class="flex-center">
                    <n-icon><PersonCircleOutline /></n-icon>
                    {{ solution.uploader }}
                </div>
            </div>
            <div class="bottom">
                <b>操作员</b>
                <div class="operators">
                    <n-tag class="margin-5" type="default" size="medium" v-for="operator in solution.content.opers">
                        op skill{{ operator.skill }}
                    </n-tag>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { Solution } from '@/types'
import { EyeOutline, TimeOutline, PersonCircleOutline } from '@vicons/ionicons5'

defineProps<{ solution: Solution }>()

function getRateText(score: number) {
    if (score <= 0) return '🙄没人评价'
    if (score > 0 && score <= 1.5) return '😒看看别的'
    if (score > 1.5 && score <= 3.5) return '🤨有风险的'
    if (score > 3.5 && score <= 4.0) return '☺️可以抄的'
    if (score >= 4.5) return '😍几乎完美'
}
</script>

<style lang="scss">
.solution-info {
    @extend .base-card;
    cursor: pointer;
    &:hover {
        box-shadow: 0 1px 2px -2px rgba(0, 0, 0, 0.08), 0 3px 6px 0 rgba(0, 0, 0, 0.06),
            0 5px 12px 4px rgba(0, 0, 0, 0.04);
    }
    > div {
        width: 50%;
        height: 100%;
        padding: 0 10px;
        box-sizing: border-box;
    }
    .left {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        white-space: pre-line;
        text-align: left;
        .title {
            margin: 0;
            font-weight: bold;
            font-size: 18px;
        }
    }
    .right {
        display: flex;
        flex-direction: column;
        .top {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            height: 80px;
        }
        .bottom {
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: flex-start;
            .operators {
                width: 100%;
                display: flex;
                justify-content: flex-start;
                flex-wrap: wrap;
            }
        }
    }
}
</style>
