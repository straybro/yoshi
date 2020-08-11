---
title: Why we moved yoshi to be private
author: Ran Yitzhaki
---

> Thanks to Ronen Amiel for helping with writing this blog post

Recently the Yoshi project has moved from being public to be a private Wix project. I'm going to explain what does it actually means and show our decision-making process.

### Focus on Wix

While Yoshi used to be more of a generic toolkit, today it is directed towards the development of applications in Wix. Our focus is to provide value for Editor-Platform apps using Editor Flow and Business-Manager modules using BM Flow.

We also have specific support for projects like Thunderbolt, Editor Elements & Editor-X. Don't worry though, standalone apps and libraries are still supported and will continue to receive new features and bug fixes.

### Enhance the visibility in the organization

Yoshi used to be developed on the Public Wix Github Organization for the last few years which meant that everything we do is visible to the public. Our discussions regarding Wix specific problems and every piece of our codebase, including runtime and server-side code.

Many people used asked us questions in the personal chat (slack) because they thought it would be inappropriate to expose or talk about such information in public. In reality, all of us can feel more comfortable sharing information when the scope of it is our organization. for example, I would need to revise this blog post for internal information if I knew it would end up as public.

### Is it good for the Wix engineering brand?

Using `create-yoshi-app` for public projects didn't work because of private dependencies in our templates and there were some missing features in order to be used outside of Wix. This has created [some confusion](https://github.com/wix-private/yoshi/issues/2578) and I believe that it didn't look so good.

In order to develop Yoshi, you need to have a VPN connection, in order to install private dependencies and see our CI. This has raised some [issues](https://github.com/wix-private/yoshi/issues/1900) which lead us to write that it's [only for Wix employees](https://github.com/wix-private/yoshi/pull/2099).

I believe that this has created some damage to us as an engineering brand, because it's not a "real open-source", but takes place amongst Wix's open-source projects. For other non-Wix developers looking at this, it may look like abuse.

### It's either all (public) or nothing

In addition to the fact that Yoshi is being developed openly, it's also gets published to the public npm registry. While there are many private dev-dependencies, we used to do many workarounds to verify that private packages aren't getting to the public npm registry. We did that because there are some packages that run on a public CI (which can't access Wix's private npm registry) and use Yoshi. Their install would fail in case there would be a private dependency used by Yoshi.

It also made it hard to add BI using Wix's infrastructure (the bi-loggers are private) and also, is it ok to send BI of non-Wix employees? This constraint certainly has made some tasks a bit more complex for us.

### We do ❤️ open source

We, the developers that work on Yoshi really love open source. We are using many open source packages as part of our work, all of us have contributed to open source projects and also have some of our own. We all know how much effort is invested in maintaining a project as an open-source.

While we could theoretically take Yoshi and make it more abstract and suitable for other companies, in reality, it would hurt our productivity and velocity in projects like Wext and Thunderbolt. We try to remember the [opportunity cost](https://en.wikipedia.org/wiki/Opportunity_cost) of investing that time in OSS. The question that we have in mind is "How can we use our time in a way that will benefit Wix developers the most".

### The cost of abstraction

While most engineers can say that in order to transform Yoshi to a real open source we can extract the core functionality and add a Wix preset. We have to remember that in practice this is more complex than it sounds, and it also comes with a cost. While we would love to get there, in reality, it takes time and effort to do. Like most of you, we are working with tight deadlines and our priority is to provide the most value to Wix's developers according to the company focus.

### Summary

I hope that this explains our decision. I wish that in the future we'll find the time to create the Wix part in the tooling open-source scenery.

#### Github

> https://github.com/wix-private/yoshi

So we've moved from the public [`wix`](https://github.com/wix) GitHub organization to [`wix-private`](https://github.com/wix-private).

#### Website

> https://bo.wix.com/pages/yoshi

We are now publishing our website under the `bo` (which means it requires `VPN` connection) using the wonderful [janet](https://github.com/wix-private/janet).

#### npm

> https://npm.dev.wixpress.com/yoshi

Starting from version [`4.88.0`](https://github.com/wix-private/yoshi/blob/master/CHANGELOG.md#4880-2020-06-09) we are publishing Yoshi to the private `npm` registry.
