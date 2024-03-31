<template>
    <Menu>
      <MenuButton>Options</MenuButton>
      <MenuItems>
        <!-- Use the `active` state to conditionally style the active item. -->
        <MenuItem
          v-for="link in links"
          :key="link.href"
          as="template"
          v-slot="{ active }"
        >
          <a
            :href="link.href"
            :class="{ 'bg-blue-500 text-white': active, 'bg-white text-black': !active }"
          >
            {{ link.label }}
          </a>
        </MenuItem>
      </MenuItems>
    </Menu>
  </template>
  
  <script setup>
    import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
  
    const links = [
      { href: '/Login', label: 'Login' },
      { href: '/facultyfom', label: 'Teacher Registration' },
      { href: '/parentform', label: 'Parent Registration' },
      { href: '/sign-out', label: 'Sign out' },
    ]
  </script>