---
title: Home
description: Hello, I am Tommy. These are my notes on various topics which includes university courses and personal learning that I have done. I hope they're useful and can help you learn something new.
---

# Home

Hello, I am Tommy. These are my notes on various topics which includes university courses and personal learning that I have done. I hope they're useful and can help you learn something new.

<div v-for="nav in $site.themeConfig.nav.filter(nav => nav.items.length > 0)">
  <h2>{{ nav.text }}</h2>
  <ul>
    <li v-for="item in nav.items">
      <router-link :to="item.link">{{ item.text }}</router-link>
    </li>
  </ul>
</div>
