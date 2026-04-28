import { ContainerBuilder, EmbedBuilder, Role } from "discord.js";

import { installKromatiqDiscord } from "./discord/install.js";
import "./discord/augment.js";

installKromatiqDiscord({
  ContainerBuilder,
  EmbedBuilder,
  Role,
});

export {};
