<!-- PageHeader Common Component -->
<template>
  <div>
    <Card class="text-3xl">
      <template #header>{{ header }}</template>
      <template #title>{{ title }}</template>
      <template #subtitle>{{ subtitle }}<slot></slot></template>
      <template #content>{{ content }}</template>
      <template #footer>{{ footer }}</template>
    </Card>
  </div>
</template>

<script>
export default {
  props: {
    header: String,
    title: String,
    subtitle: String,
    content: String,
    footer: String,
  },
  setup(props) {
    const { header, title, subtitle, content, footer } = props;
    return {
      header,
      title,
      subtitle,
      content,
      footer,
    };
  },
};
</script>

<style scoped>
.p-card {
  background-color: #e8ecef;
  color: #2b3e50;
}
</style>
