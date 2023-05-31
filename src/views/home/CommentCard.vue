<template>
    <div class="w-full px-4 py-3 m-3 box-border border border-solid border-[rgb(199,199,203)] rounded-lg">
        <div>
            <span class="flex items-center gap-1 font-medium sm:text-base">
                <n-tag :color="{ color: stringToRGB(comment.uploader), borderColor: 'transparent' }">
                    <span :style="{ color: isLightColor(stringToRGB(comment.uploader)) ? 'black' : 'white' }">
                        {{ comment.uploader }}
                    </span>
                </n-tag>
                <n-tag v-if="isAuthor(comment.uploader)" type="primary">作者</n-tag>

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
                    <n-tag
                        :color="{
                            textColor: stringToRGB(subComment.uploader),
                            borderColor: stringToRGB(subComment.uploader),
                        }"
                    >
                        {{ subComment.uploader }}
                    </n-tag>
                    <n-tag v-if="isAuthor(subComment.uploader)" type="primary">作者</n-tag>

                    <n-time
                        class="text-xs text-gray-500"
                        :time="new Date(subComment.uploadTime).getTime()"
                        :to="Date.now()"
                        type="relative"
                    />
                </span>

                <p class="line-clamp-2 text-sm text-gray-700">
                    <n-tag
                        :bordered="false"
                        v-if="getReplyToName(subComment.fromCommentId, comment.subCommentsInfos)"
                        :color="{
                            color: 'transparent',
                            textColor: stringToRGB(getReplyToName(subComment.fromCommentId, comment.subCommentsInfos)),
                        }"
                    >
                        {{ '@' + getReplyToName(subComment.fromCommentId, comment.subCommentsInfos) + ':' }}
                    </n-tag>
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
import { MainCommentInfo, SubCommentInfo } from '@/models/comment'
import { ChatboxEllipsesOutline, CaretUp, CaretDown } from '@vicons/ionicons5'
import { stringToRGB, isLightColor } from '@/utils'
const { author } = defineProps<{ comment: MainCommentInfo; author?: string }>()

const getReplyToName = (commentId: string, subComments: SubCommentInfo[]) =>
    subComments.find((subComment) => subComment.commentId === commentId)?.uploader
const isAuthor = (name: string) => name === author
</script>
