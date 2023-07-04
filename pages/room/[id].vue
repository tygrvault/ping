<script setup lang="ts">
import { Database } from 'utils/supabase';
import {
    TransitionRoot,
    TransitionChild,
    Dialog,
    DialogPanel,
    DialogTitle,
} from '@headlessui/vue'

const route = useRoute();
const router = useRouter();
const user = useSupabaseUser();
const client = useSupabaseClient<Database>();

// message state
const msg = ref("");

// room state
const isOpen = ref(false)
function setIsOpen(value: boolean) {
    isOpen.value = value
}

// get room
let { data: rooms, error } = await client.from("rooms").select("*").eq("id", route.params.id);

if (error) {
    router.push("/rooms");
}

const room = rooms![0];

// get room messages
let { data: messages } = await client.from("messages").select("*").eq("room_id", route.params.id);


// send message func
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

// delete room func
const deleteRoom = async () => {
    if (room.author_id !== user.value?.id) return;
    const { data: res, error } = await client.from("rooms").delete().eq("id", room.id);
    if (error) return console.error(error);
    else router.push("/rooms");
}
</script>

<template>
    <div v-show="room" class="flex flex-col justify-center items-center w-screen h-screen">
        <!-- delete room modal -->
        <TransitionRoot appear :show="isOpen" as="template">
            <Dialog as="div" @close="setIsOpen(false)" class="relative z-10">
                <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100"
                    leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
                    <div class="fixed inset-0 bg-black bg-opacity-50" />
                </TransitionChild>
                <div class="fixed inset-0 overflow-y-auto">
                    <div class="flex min-h-full items-center justify-center p-4 text-center">
                        <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95"
                            enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100"
                            leave-to="opacity-0 scale-95">
                            <DialogPanel
                                class="w-full max-w-md transform overflow-hidden rounded-2xl bg-neutral-100 dark:bg-neutral-900 p-6 text-left align-middle shadow-xl transition-all">
                                <DialogTitle as="h3" class="text-lg font-medium leading-6">
                                    Delete room
                                </DialogTitle>
                                <div class="mt-2">
                                    <p class="text-sm">
                                        Are you sure you want to delete this room? All of the messages in here will be
                                        permenantly deleted. This action cannot be undone.
                                    </p>
                                </div>
                                <div class="mt-4 justify-between flex flex-row gap-2">
                                    <Button type="button" @click="setIsOpen(false)">
                                        Cancel
                                    </Button>
                                    <Button type="button" @click="deleteRoom()"
                                        class="bg-red-500 dark:bg-red-600 hover:bg-red-600 dark:hover:bg-red-700/100">
                                        Do it.
                                    </Button>
                                </div>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </TransitionRoot>
        <div class="w-5/6 md:w-1/2 h-2/3 rounded-lg mb-5 flex flex-col pt-4 pb-2">
            <div class="h-8 flex-row mb-8 flex justify-between items-center">
                <a href="/rooms">
                    <Button>
                        Back
                    </Button>
                </a>
                <h2 class="font-medium text-lg">
                    {{ room.name }}
                </h2>
                <Button class="px-2 py-2" @click="setIsOpen(true)" v-show="user?.id === room.author_id">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                        class="lucide lucide-trash-2">
                        <path d="M3 6h18" />
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                        <line x1="10" x2="10" y1="11" y2="17" />
                        <line x1="14" x2="14" y1="11" y2="17" />
                    </svg>
                </Button>
            </div>
            <div class="flex-auto overflow-y-scroll pr-4 border-black/10 dark:border-white/10 border rounded-lg">
                <Message v-for="message in messages" :avatar="message.avatar" :content="message.content"
                    :username="message.username" />
            </div>
        </div>
        <div
            class="w-5/6 md:w-1/2 h-12 flex-none rounded-full flex items-center border border-black/10 dark:border-white/10">
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