<template>
    <div class="w-full px-4 py-3 m-3 box-border border border-solid border-[rgb(199,199,203)] rounded-lg">
        <div>
            <span class="flex items-center gap-1 font-medium sm:text-base">
                <div class="w-8 h-6" :style="{ backgroundColor: stringToRGB(comment.uploader) }">
                    <span :style="{ color: isLightColor(stringToRGB(comment.uploader)) ? 'black' : 'white' }">
                        {{ comment.uploader.slice(0,2) }}
                    </span>
                </div>
                {{ comment.uploader }}
                <!-- &middot; -->
                <n-time
                    class="text-xs text-gray-500"
                    :time="new Date(comment.uploadTime).getTime()"
                    :to="Date.now()"
                    type="relative"
                />
            </span>

            <p class="line-clamp-2 text-sm text-gray-700">
                {{ comment.message }}
            </p>

            <div class="m-2 sm:flex sm:items-center sm:gap-2">
                <div class="flex items-center gap-1 text-xs text-gray-500">
                    <n-icon size="16">
                        <CaretUp />
                    </n-icon>
                    {{ comment.like }}
                    <n-icon size="16">
                        <CaretDown />
                    </n-icon>
                    &nbsp;&nbsp;
                    <span class="flex gap-1 items-center" v-if="comment.subCommentsInfos.length > 0">
                        <n-icon size="16">
                            <ChatboxEllipsesOutline />
                        </n-icon>
                        {{ comment.subCommentsInfos.length }}
                    </span>
                </div>
            </div>
        </div>
        <div
            v-for="subComment in comment.subCommentsInfos"
            :key="subComment.commentId"
            class="w-full px-4 py-3 mx-3 box-border border-solid border-[rgb(239,239,245)] border-0 border-t-2"
        >
            <div>
                <span class="flex items-center gap-1 font-medium sm:text-base">
                    <div class="w-8 h-6" :style="{ backgroundColor: stringToRGB(subComment.uploader) }">
                        <span :style="{ color: isLightColor(stringToRGB(subComment.uploader)) ? 'black' : 'white' }">
                            {{ subComment.uploader.slice(0,2) }}
                        </span>
                    </div>
                    {{ subComment.uploader }}
                    <!-- &middot; -->
                    <n-time
                        class="text-xs text-gray-500"
                        :time="new Date(subComment.uploadTime).getTime()"
                        :to="Date.now()"
                        type="relative"
                    />
                </span>

                <p class="line-clamp-2 text-sm text-gray-700">
                    {{ subComment.message }}
                </p>

                <div class="mt-2 sm:flex sm:items-center sm:gap-2">
                    <div class="flex items-center gap-1 text-xs text-gray-500">
                        <n-icon size="16">
                            <CaretUp />
                        </n-icon>
                        {{ subComment.like }}
                        <n-icon size="16">
                            <CaretDown />
                        </n-icon>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { MainCommentInfo } from '@/models/comment'
import { ChatboxEllipsesOutline, CaretUp, CaretDown } from '@vicons/ionicons5'
import { stringToRGB, isLightColor } from '@/utils'
defineProps<{ comment: MainCommentInfo }>()
</script>
