import type { TinaField } from "tinacms";
export function blog_postFields() {
  return [
    {
      type: "string",
      name: "title",
      label: "Blog Post Title",
    },
    {
      type: "datetime",
      name: "date",
      label: "Date Posted",
    },
    {
      type: "string",
      name: "description",
      label: "Post Description",
    },
    {
      type: "boolean",
      name: "showDate",
      label: "Show Date",
    },
    {
      type: "boolean",
      name: "showAuthor",
      label: "showAuthor",
    },
    {
      type: "boolean",
      name: "showReadingTime",
      label: "Show Reading Time",
    },
    {
      type: "boolean",
      name: "showEdit",
      label: "showEdit",
    },
    {
      type: "boolean",
      name: "showPagination",
      label: "showPagination",
    },
    {
      type: "boolean",
      name: "showTableOfContents",
      label: "Show Table of Contents",
    },
    {
      type: "boolean",
      name: "showWordCount",
      label: "Show Word Count",
    },
    {
      type: "boolean",
      name: "showSummary",
      label: "Show Summary",
    },
  ] as TinaField[];
}
