<script setup lang="ts">
const user = useSupabaseUser()
const client = useSupabaseAuthClient()

const login = async (provider: 'github') => {
  const { error } = await client.auth.signInWithOAuth({ provider });

  if (error) {
    return alert("Something went wrong, please try again later.");
  }
}
</script>

<template>
  <div class="flex h-screen">
    <div class="m-auto">
      <div class="flex flex-col items-center justify-center gap-6">
        <div class="flex flex-col items-center justify-center">
          <div class="flex flex-row gap-2 items-center">
            <svg class="w-16 h-16" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12z"
                clip-rule="evenodd" />
            </svg>
            <h1 class="text-4xl font-bold">Ping</h1>
          </div>
          <p class="text-neutral-400">
            A small scale chat application by tygerxqt.
          </p>
        </div>
        <div class="flex flex-row gap-2" v-show="user">
          <a href="/rooms">
            <Button>
              Continue as {{ user?.user_metadata.user_name || user?.email || user?.user_metadata.full_name }}
            </Button>
          </a>
          <Button @click="client.auth.signOut()">
            Log out
          </Button>
        </div>
        <button v-show="!user"
          class="bg-neutral-200 transition-colors dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-900 p-2 rounded-md flex flex-row gap-2"
          @click="login('github')">
          <svg viewBox="0 0 24 24" class="fill-current w-6 h-6" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12">
            </path>
          </svg>
          Sign up with Github
        </button>
      </div>
    </div>
  </div>
</template>
