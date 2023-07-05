<script setup lang="ts">
import { Database } from 'utils/supabase';
import {
    TransitionRoot,
    TransitionChild,
    Dialog,
    DialogPanel,
    DialogTitle,
} from '@headlessui/vue'

definePageMeta({
    middleware: [
        'auth'
    ]
});

const router = useRouter();
const user = useSupabaseUser();
const client = useSupabaseClient<Database>();

// Create room modal state
const isOpen = ref(false)
const name = ref("");
const description = ref("");

function setIsOpen(value: boolean) {
    isOpen.value = value
}

// rooms realtime state
const loading = ref(true);
const rooms = ref<Database["public"]["Tables"]["rooms"]["Row"][]>([]);

async function getRooms() {
    let { data } = await client.from("rooms").select("*");
    if (!data) return;
    rooms.value = data;
}

const roomsChannel = client.channel('any')
    .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'rooms' },
        async (payload) => {
            await getRooms();
        }
    )
    .subscribe()

const createRoom = async (name: string, description: string) => {
    if (!name || !description) return;
    await client.from("rooms").insert({
        name: name,
        description: description,
        author_id: user.value?.id as string
    }).then(() => {
        setIsOpen(false);
    })
}

onBeforeMount(() => {
    getRooms().then(() => {
        loading.value = false;
    });
})

onBeforeUnmount(() => {
    roomsChannel.unsubscribe();
});
</script>

<template>
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
                                Create a new room
                            </DialogTitle>
                            <div class="mt-2 gap-2 flex flex-col">
                                <p class="text-neutral-400">
                                    Please fill in the following fields to create a new room.
                                </p>
                                <input type="text" placeholder="Name" v-model="name" required
                                    class="w-full rounded-md p-2 bg-neutral-200 dark:bg-neutral-800 outline-none"
                                    maxlength="12" />
                                <input type="text" placeholder="Description" v-model="description" required
                                    class=" w-full rounded-md p-2 bg-neutral-200 dark:bg-neutral-800 outline-none"
                                    maxlength="24" />
                            </div>
                            <div class="mt-4 justify-between flex flex-row gap-2">
                                <Button type="button" @click="setIsOpen(false)">
                                    Cancel
                                </Button>
                                <Button type="button" @click="createRoom(name, description)"
                                    class="bg-neutral-800 hover:bg-neutral-900">
                                    Create
                                </Button>
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>
    <div class="flex h-screen">
        <div class="m-auto">
            <div class="flex flex-col gap-4 items-center py-8">
                <div class="flex flex-col items-center">
                    <h1 class="text-3xl font-bold">Rooms</h1>
                    <p class="text-neutral-400">An enitre list of all avalible rooms.</p>
                </div>
                <Button class="flex flex-row gap-2 items-center" @click="setIsOpen(true)">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18.5" height="18.5" viewBox="0 0 20 20" fill="none">
                        <path
                            d="M18 11.3306H11.3333V17.9973C11.3333 18.3509 11.1928 18.69 10.9428 18.9401C10.6927 19.1901 10.3536 19.3306 9.99996 19.3306C9.64634 19.3306 9.3072 19.1901 9.05715 18.9401C8.8071 18.69 8.66663 18.3509 8.66663 17.9973V11.3306H1.99996C1.64634 11.3306 1.3072 11.1901 1.05715 10.9401C0.807102 10.69 0.666626 10.3509 0.666626 9.99727C0.666626 9.64365 0.807102 9.30451 1.05715 9.05447C1.3072 8.80442 1.64634 8.66394 1.99996 8.66394H8.66663V1.99727C8.66663 1.64365 8.8071 1.30451 9.05715 1.05446C9.3072 0.804416 9.64634 0.66394 9.99996 0.66394C10.3536 0.66394 10.6927 0.804416 10.9428 1.05446C11.1928 1.30451 11.3333 1.64365 11.3333 1.99727V8.66394H18C18.3536 8.66394 18.6927 8.80442 18.9428 9.05447C19.1928 9.30451 19.3333 9.64365 19.3333 9.99727C19.3333 10.3509 19.1928 10.69 18.9428 10.9401C18.6927 11.1901 18.3536 11.3306 18 11.3306Z"
                            fill="currentColor" />
                    </svg>
                    Create a new room
                </Button>
                <p v-if="loading" class="text-neutral-400">Loading...</p>
                <Button v-for="room in rooms" @click="router.push('room/' + room.id.toString())">
                    {{ room.name }} - {{ room.description }}
                </Button>
            </div>
        </div>
    </div>
</template>