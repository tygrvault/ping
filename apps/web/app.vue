<template>
  <main className="flex flex-col items-center justify-center w-full">
    <div className="flex flex-col gap-4 max-w-[800px] w-full">
      <NuxtPage class="w-full" />
    </div>
  </main>
</template>

<style>
body {
  background-color: #f5f5f5;
  color: black;

  ::-webkit-scrollbar {
    width: 10px;
  }

  ::-webkit-scrollbar-track {
    background: #f1f1f1;

    @media (prefers-color-scheme: dark) {
      background: #1f1f1f;
    }
  }

  ::-webkit-scrollbar-thumb {
    background: #888;

    @media (prefers-color-scheme: dark) {
      background: #888;
    }
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #555;

    @media (prefers-color-scheme: dark) {
      background: #555;
    }
  }

  @media (prefers-color-scheme: dark) {
    background-color: black;
    color: white;
  }
}
</style>