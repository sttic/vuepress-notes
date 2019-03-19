---
title: Home
description: Hello, I am Tommy. These are my notes on various topics which includes university courses and personal learning that I have done. I hope they're useful and can help you learn something new.
---

# Home

Hello, I am Tommy. These are my notes on various topics which includes university courses and personal learning that I have done. I hope they're useful and can help you learn something new.

## Courses

Courses from the University of Ottawa.

<ul>
  <li v-for="item in $site.themeConfig.nav.filter(element => element.text === 'Courses')[0].items">
    <router-link :to="item.link">{{ item.text }}</router-link>
  </li>
</ul>
