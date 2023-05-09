import { defineConfig } from "tinacms";
import { blog_postFields } from "./templates";

// Your hosting provider likely exposes this as an environment variable
const branch = process.env.HEAD || process.env.VERCEL_GIT_COMMIT_REF || "main";
const clientIDENV: string = process.env.TINA_CLIENT ?? "Could not find clientID";
const tokenENV: string = process.env.TINA_TOKEN ?? "Could not find token";

export default defineConfig({
  branch,
  clientId: clientIDENV, // Get this from tina.io
  token: tokenENV, // Get this from tina.io
  client: { skip: true },
  build: {
    outputFolder: "admin",
    publicFolder: "static",
  },
  media: {
    tina: {
      mediaRoot: "uploads",
      publicFolder: "static",
    },
  },
  schema: {
    collections: [
      {
        format: "md",
        label: "Blog",
        name: "blog",
        path: "content/blog",
        frontmatterFormat: "toml",
        frontmatterDelimiters: "+++",
        ui: {
          filename: {
            readonly: true,
          },  
        },
        match: {
          include: "**/*",
        },
        fields: [
          {
            type: "rich-text",
            name: "body",
            label: "Body of Document",
            description: "This is the markdown body",
            isBody: true,
            templates: [
              {
                name: 'alert',
                label: 'alert',
                match: {
                  start: '{{<',
                  end: '>}}',
                },
                fields: [
                  {
                    name: 'body',
                    label: 'Body',
                    type: 'string',
                    required: true,
                    ui: {
                      component: 'textarea',
                    },
                  },
                  {
                    name: 'icon',
                    label: 'Icon - Supported icons: comment, instagram, email, facebook, twitter, moon, search, soundcloud, tag, youtube, lightbulb. Defaults to traingle warning icon.',
                    type: 'string',
                    required: false,
                    ui: {
                      component: 'text',
                    },
                  },
                ],
              },
              {
                name: 'twitter',
                label: 'tweet',
                match: {
                  start: '{{<',
                  end: '>}}',
                },
                fields: [
                  {
                    name: 'id',
                    label: 'Tweet ID',
                    type: 'string',
                    required: true,
                    ui: {
                      component: 'text',
                    },
                  },
                  {
                    name: 'user',
                    label: 'Twitter Username - put without the @',
                    type: 'string',
                    required: true,
                    ui: {
                      component: 'text',
                    },
                  }
                ],
              },
              {
                name: 'youtube',
                label: 'youtube',
                match: {
                  start: '{{<',
                  end: '>}}',
                },
                fields: [
                  {
                    name: 'id',
                    label: 'Youtube video ID - found in the URL of the video',
                    type: 'string',
                    required: true,
                    ui: {
                      component: 'text',
                    },
                  },
                ],
              }
            ],   
          },
          ...blog_postFields(),
        ],
      },
      {
        format: "md",
        label: "About",
        name: "about",
        path: "content/about",
        frontmatterFormat: "toml",
        frontmatterDelimiters: "+++",
        ui: {
          filename: {
            readonly: true,
          },
          allowedActions: {
            create: false,
            delete: false
          }
        },
        match: {
          include: "**/*",
        },
        fields: [
          {
            name: 'title',
            label: 'Title',
            type: 'string',
            isTitle: true,
            required: true,
            ui: {
              component: 'text',
            },
          },
          {
            type: "rich-text",
            name: "body",
            label: "Body of Document",
            description: "This is the markdown body",
            isBody: true,
            templates: [
              {
                name: 'alert',
                label: 'alert',
                match: {
                  start: '{{<',
                  end: '>}}',
                },
                fields: [
                  {
                    name: 'body',
                    label: 'Body',
                    type: 'string',
                    required: true,
                    ui: {
                      component: 'textarea',
                    },
                  },
                  {
                    name: 'icon',
                    label: 'Icon - Supported icons: comment, instagram, email, facebook, twitter, moon, search, soundcloud, tag, youtube, lightbulb. Defaults to traingle warning icon.',
                    type: 'string',
                    required: false,
                    ui: {
                      component: 'text',
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
});
