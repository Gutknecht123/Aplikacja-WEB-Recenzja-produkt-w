<template>
<div>

    
    <div class="login-section">
    <div class="login-text">Login:</div>
    <div class="login-input"><input type="text"></div>
    <br>
    <div class="password-text">Password:</div>
    <div class="password-input"><input type="password"></div>
    <br>
    <a href="#/"><button>Login</button></a>
    <br>
    <br>
    <img src="https://cdn.betterttv.net/emote/5b554609c0c5fe4072478d04/3x" alt="">
    </div>

    
</div>
</template>

<script>



export default { 
     name: 'LoginSection'
}
</script>

<style scoped>

h2{

    color: white;

}
.login-section{

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: white;
    
    

}
.login-section > button{

    width: 20%;

}

</style>