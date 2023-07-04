<script setup lang="ts">
import { Database } from 'utils/supabase';

const route = useRoute();
const router = useRouter();
const user = useSupabaseUser();
const client = useSupabaseClient<Database>();

const msg = ref("");

let { data: rooms, error } = await client.from("rooms").select("*").eq("id", route.params.id);

if (error) {
    router.push("/rooms");
}

const room = rooms![0];

let { data: messages } = await client.from("messages").select("*").eq("room_id", route.params.id);

const sendMessage = async () => {
    if (!msg.value) return;
    await client.from("messages").insert({
        content: msg.value.toString(),
        room_id: room.id,
        author_id: user.value?.id as string,
        avatar: user.value?.user_metadata.avatar_url as string,
        username: user.value?.user_metadata.user_name as string
    });
}
</script>

<template>
    <div v-show="room" class="flex flex-col justify-center items-center w-screen h-screen ">
        <div class="w-5/6 md:w-1/2 h-2/3 rounded-lg mb-5 flex flex-col pt-4 pb-2">
            <div class="h-8 flex-row pl-1 pr-7 mb-8 flex justify-between items-center">
                <a href="/rooms">
                    <Button>
                        Back
                    </Button>
                </a>
                <h2 class="font-medium text-lg">
                    {{ room.name }}
                </h2>
                <div />
            </div>
            <div class="flex-auto overflow-y-scroll pr-4 border-black/10 dark:border-white/10 border rounded-lg">
                <Message v-for="message in messages" :avatar="message.avatar" :content="message.content"
                    :username="message.username" />
            </div>
        </div>
        <div
            class="w-5/6 md:w-1/2 h-16 flex-none rounded-full flex items-center border border-black/10 dark:border-white/10">
            <input type="text" placeholder="Message" class="block mx-6 w-full bg-transparent outline-none" v-model="msg">
            <button class="mx-3 p-2 hover:bg-neutral-800 rounded-2xl" @click="sendMessage()">
                <svg class="w-5 h-5 text-neutral-400 origin-center transform rotate-90" xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20" fill="currentColor">
                    <path
                        d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z">
                    </path>
                </svg>
            </button>
        </div>
    </div>
    <div v-show="!room">
        <div class="flex h-screen">
            <div class="m-auto">
                <h1>
                    Room {{ route.params.id }} not found.
                </h1>
            </div>
        </div>
    </div>
</template>