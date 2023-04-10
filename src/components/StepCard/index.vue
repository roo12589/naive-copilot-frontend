<template>
    <div class="step-card">
        <div class="corner-mark" v-if="mark"><slot name="mark"></slot></div>
        <div class="title">
            <slot name="title">
                <n-icon :component="getIcon(type.value)"></n-icon>

                {{ type.title }}
            </slot>
        </div>
        <div class="content">
            <slot>
                <n-space v-if="action.type == CopilotDocV1.Type.Deploy" class="action">
                    <div class="flex-center">
                        <n-icon><PersonCircleOutline /></n-icon>
                        {{ action.type }}
                    </div>
                    <div class="flex-center">
                        <n-icon><LocationOutline /></n-icon>
                        {{ action.location }}
                    </div>
                    <div class="flex-center">
                        <n-icon><MoveSharp /></n-icon>
                        {{ action.direction }}
                    </div>
                </n-space>
            </slot>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { PersonCircleOutline, LocationOutline, MoveSharp, Checkmark, Help } from '@vicons/ionicons5'
import { CopilotDocV1 } from '@/models/copilot.schema'
import { findActionType } from '@/models/types'
const props = withDefaults(
    defineProps<{
        mark?: boolean
        title?: string
        action: CopilotDocV1.Action
    }>(),
    {
        mark: false,
    }
)
console.log(props)
const type = findActionType(props.action.type)
const getIcon = (s: string) => {
    const map = new Map([
        [CopilotDocV1.Type.Deploy, Checkmark],
        [CopilotDocV1.Type.Retreat, Checkmark],
        [CopilotDocV1.Type.BulletTime, Checkmark],
        [CopilotDocV1.Type.MoveCamera, Checkmark],
        [CopilotDocV1.Type.SpeedUp, Checkmark],
        [CopilotDocV1.Type.Output, Checkmark],
        [CopilotDocV1.Type.Skill, Checkmark],
        [CopilotDocV1.Type.SkillDaemon, Checkmark],
        [CopilotDocV1.Type.SkillUsage, Checkmark],
        ['Unknown', Help],
    ])
    return map.get(s)
}
// const ac: CopilotDocV1.Action = {
//     type: CopilotDocV1.Type.SpeedUp,
// }
</script>

<style scoped lang="scss">
.step-card {
    padding: 12px;
    margin: 10px 0;
    position: relative;
    border: 1px solid rgb(239, 239, 245);
    border-radius: 10px;
    transition: all 0.3s;
    .title {
        font-size: 18px;
        font-weight: bold;
        display: flex;
        align-items: center
    }
    .corner-mark {
        @extend .flex-center;
        padding: 5px;
        position: absolute;
        left: 0;
        top: 0;
        min-width: 5px;
        background-color: #fff;
        transform: translate(5px, -50%);
        transform-origin: 0 0;
        color: #999aaa;
    }
}
</style>
