<template>
<div>
    <NavbarSection/>
    <SearchComponent/>
</div>
</template>
<script>
import SearchComponent from '../components/SearchComponent';
import NavbarSection from '../components/NavbarComponent';
export default {
    
    components:{
        SearchComponent,
        NavbarSection
    }

}
</script>