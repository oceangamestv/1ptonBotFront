<template>
    <div class="container">
        <div class="centered">🥈 Silver League ›</div>
    </div>
</template>

<style scoped>
.container {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(128, 128, 128, 0.1);
    border-radius: 15px;
    padding: 10px 20px;
    margin: 20px;
}

.centered {
    display: inline-flex; /* Зробити span схожим на flex контейнер для вертикального центрування тексту */
    justify-content: center; /* Горизонтальне центрування */
    align-items: center; /* Вертикальне центрування */
}
</style>
