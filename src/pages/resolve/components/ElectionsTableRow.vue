<template v-slot:body="props">
	<div>
		<span>{{JSON.stringify(props.row)}}</span>
		<q-tr :props="props">
			<q-td auto-width>
				<q-btn
					size="sm"
					color="primary"
					round
					dense
					@click="props.expand = !props.expand" :icon="props.expand ? 'remove' : 'add'"
				/>
			</q-td>
			<q-td key="ballot_name" :props="props" class="ballot_name">
				<div class="info">
					<div class="ballot-name">{{ props.row.ballot_name || `${props.row.election_id}` }}</div>
					<div class="ballot-subtitle">This is some description</div>
				</div>
			</q-td>
			<q-td key="available_seats" :props="props" class="default">
				<span>Seats</span><br />
				<span>{{ props.row.available_seats }}</span>
			</q-td>
			<q-td key="end_add_candidates_ts" :props="props" class="default">
				<span>End Nomination</span><br />
				<span>{{ props.row.end_add_candidates_ts }}</span>
			</q-td>
			<q-td key="begin_voting_ts" :props="props" class="default">
				<span>Start Voting</span><br />
				<span>{{ props.row.begin_voting_ts }}</span>
			</q-td>
			<q-td key="end_voting_ts" :props="props" class="default">
				<span>End Voting</span><br />
				<span>{{ props.row.end_voting_ts }}</span>
			</q-td>

			<q-td key="info_url" :props="props">
				<ipfs-link :hash="props.row.info_url">
					{{props.row.info_url}}
				</ipfs-link>
			</q-td>
			<q-td key="status" :props="props">
				{{ ELECTION_STATUS[props.row.status] }}
			</q-td>
		</q-tr>
		<q-tr v-show="props.expand" :props="props" class="expanded-row">
			<candidates-cell
				:props="props"
				colspan="100%"
				class="text-left"
				:totalVotes="totalVotes"
			/>
		</q-tr>
	</div>
</template>

<script>

</script>

<style lang="scss" scoped>

</style>
