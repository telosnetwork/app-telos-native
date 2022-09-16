<template>
	<div>
		<intro-card
			heading="Create a new case"
			text="Do you have an asset related issue that you’d like the network’s arbitration system to resolve? We believe that a transparent process benefits everyone."
			buttonText="Create a new case"
		/>
		<case-files-table />
	</div>
</template>

<script>
import IntroCard from '../../components/IntroCard.vue'
import CaseFilesTable from '../../components/CaseFilesTable.vue'

export default {
  components: {
    IntroCard,
    CaseFilesTable
  }
}
</script>

<style lang="scss" scoped>

</style>
