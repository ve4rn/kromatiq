declare module "discord.js" {
  export class EmbedBuilder {
    setColor(color: unknown): this;
  }

  export class ContainerBuilder {
    setAccentColor(color: unknown): this;
  }

  export class Role {
    setColors(colors: unknown, reason?: string): Promise<Role>;
  }
}
