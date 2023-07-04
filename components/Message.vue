<script setup lang="ts">
const props = defineProps({
    avatar: String,
    username: String,
    content: String
})
</script>

<template>
    <div class="flex flex-row gap-2 w-full p-2 rounded-md my-2">
        <img :src="$props.avatar" width="32" height="32"
            class="border border-black/10 dark:border-white/10 rounded-full w-12 h-12" />
        <div>
            <b>
                {{ username }}
            </b>
            <p class="overflow-ellipsis">
                {{ content }}
            </p>
        </div>
    </div>
</template>