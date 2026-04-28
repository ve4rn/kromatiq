declare module "discord.js" {
  interface EmbedBuilder {
    setColor(color: import("../types.js").ColorInput): this;
  }

  interface ContainerBuilder {
    setAccentColor(color: import("../types.js").ColorInput): this;
  }

  interface Role {
    setColors(
      colors:
        | import("../types.js").ColorInput
        | readonly [import("../types.js").ColorInput, import("../types.js").ColorInput]
        | import("../types.js").DiscordRoleColors
        | {
            primaryColor: import("../types.js").ColorInput;
            secondaryColor?: import("../types.js").ColorInput;
            tertiaryColor?: import("../types.js").ColorInput;
          },
      reason?: string,
    ): Promise<Role>;
  }
}
