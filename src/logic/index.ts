import { usePlugin } from '@/main';
import { debounce } from '@/utils';
import { ref, watch } from 'vue';

interface EnhancerSettings {
  useVip: boolean;
  boxId: string;
  sqlLimit: number;
  floatingBallPlatform: 'all' | 'only-mobile' | 'none';
}

const defaultSettings: EnhancerSettings = {
  useVip: true,
  boxId: '',
  sqlLimit: 999999999,
  floatingBallPlatform: 'all',
}

let doNotSave = false
let settings = ref<EnhancerSettings>({} as EnhancerSettings)
watch(settings, () => {
  if (doNotSave) {
    doNotSave = false
    return
  }
  saveSettings()
}, {
  deep: true,
})

let STORAGE_KEY = 'SyEnhancerSettings'
let loaded = false

export function useSettings() {
  if (!loaded) {
    loadSettings()
  }
  return settings
}

export function loadSettings() {
  const plugin = usePlugin()
  plugin.loadData(STORAGE_KEY).then((res) => {
    if (res) {
      settings.value = res
    } else {
      settings.value = JSON.parse(JSON.stringify(defaultSettings))
    }
    loaded = true
  })
}

export const saveSettings = debounce(()=> {
  const plugin = usePlugin()
  const info = JSON.stringify(settings.value);
  plugin.saveData(STORAGE_KEY, info)
  localStorage.setItem(STORAGE_KEY, info)
})

export const syncLocalStorage = (event) => {
  if (event.key === STORAGE_KEY) {
    const newSettings = JSON.parse(event.newValue)
    doNotSave = true
    settings.value = newSettings
  }
}