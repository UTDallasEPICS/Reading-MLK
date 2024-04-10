<template>
    <header class="page-header">
        <div class="left">
            <nuxt-link to="/">
                <img src="../public/bookshelf_icon-icons.com_54414.ico" alt=" Your Logo " />
            </nuxt-link>
        </div>
        <div class="right">
            <nuxt-link to="/EditFamily"> EditFamily </nuxt-link> 
            <nuxt-link to="/EntryPageStudent"> EntryPageStudent </nuxt-link> 
        </div>
    </header>
</template>

<style scoped>
a {
    text-decoration: none;
}
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #122C4F; /* Set the background to navy*/
  color: #ffffff; /* Set the text color to white */
  padding: 20px 20px;
}

.left {
  display: flex;
  align-items: center;
  text-decoration: none;
}

.left :hover{
    color:#ffffff;
    text-decoration: none;
}
.left :visited{
    color:#ffffff;
    text-decoration: none;
}
.left img {
  width: auto; /* Adjust the image size as needed */
  height: 60px;
}
.right {
    color:bisque;
    text-decoration: none;
}
.right :hover{
    color:#ffffff;
    text-decoration: none;
}
.right :visited{
    color:#ffffff;
    text-decoration: none;
}
.right a{
    margin-left: 20px;
}
.right :link{
    color:bisque;
}
</style>