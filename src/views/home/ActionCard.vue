<template>
    <div class="p-3 my-2 relative border border-solid border-[rgb(239,239,245)] rounded-lg transition-all">
        <div class="flex justify-center items-center px-1 left-0 top-0 min-w-[0.25rem] bg-white translate-x-[5px] translate-y-[-50%] origin-top-left text-gray-400" v-if="mark">
            <slot name="mark"></slot>
        </div>
        <div class="text-lg flex items-center">
            <slot name="title">
                <n-icon :component="getIcon(type.value)"></n-icon>

                {{ type.title }}
            </slot>
        </div>
        <div class="content">
            <slot>
                <n-space v-if="action.type == CopilotDocV1.Type.Deploy" class="action">
                    <div class="flex justify-center items-center">
                        <n-icon><PersonCircleOutline /></n-icon>
                        {{ action.type }}
                    </div>
                    <div class="flex justify-center items-center">
                        <n-icon><LocationOutline /></n-icon>
                        {{ action.location }}
                    </div>
                    <div class="flex justify-center items-center">
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
// console.log(props)
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
