<template>
    <div class="resource-item" @dragstart="dragStart">
        <el-image style="width:100px;height:100px" :src="data.cover"></el-image>
        <span>{{ data.name }}</span>
    </div>
</template>
  
<script setup lang="ts">
import { computed } from 'vue';
import { useTrackState } from '@/stores/useTrackState';
const props = defineProps({
    data: {
        type: Object,
        default() {
            return {};
        }
    },
    type: {
        type: String,
        default: ''
    }
});
const formatData = computed(() => {
    let { time, frameCount } = props.data;
    if (props.type === 'video' && !time) {
        time = parseInt(`${frameCount / 30 * 1000}`);
    }
    return {
        ...props.data,
        time
    };
});

const store = useTrackState();
function dragStart(event: DragEvent) {
    event.stopPropagation();
    const dragInfo = {
        type: props.type,
        ...formatData.value
    };
    store.dragData.dataInfo = JSON.stringify(dragInfo);
    store.dragData.dragType = props.type;
    store.dragData.dragPoint.x = event.offsetX;
    store.dragData.dragPoint.y = event.offsetY;
    store.selectTrackItem.line = -1;
    store.selectTrackItem.index = -1;
}

</script>