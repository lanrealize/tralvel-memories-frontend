// components/time-picker/time-picker.
import { getDateSelections, getCurrentTime, getIndicesFromDate } from "../../utils/utils"
import { ComponentWithStore } from 'mobx-miniprogram-bindings';
import { photoCreationStore } from '../../stores/photoCreationStore'
import { TimePickerComponentData } from '../../models/component-model/time-picker-model'

ComponentWithStore<any, TimePickerComponentData, any, any, any>({

  storeBindings: [
    {
      store: photoCreationStore,
      fields: ['photoCreationTime'],
      actions: ['setPhotoCreationTime']
    }
  ],

  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    years: [] as string[],
    months: [] as string[],
    days: [] as string[],
    hours: [] as string[],
    minutes: [] as string[]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    setDateinitialSelections() {
      const dateSelections = getDateSelections();
      this.setData({
        'years': dateSelections.years,
        'months': dateSelections.months,
        'days': dateSelections.days,
        'hours': dateSelections.hours,
        'minutes': dateSelections.minutes
      })
    },

    bindChange(event: any) {
      // const indices = event.detail.value;

      // this.setPhoteCreationTime(concateDateStrings(this.data.years[indices[0]], this.data.months[indices[1]], this.data.days[indices[2]], this.data.hours[indices[3]], this.data.minutes[indices[4]]));
    }
  },

  lifetimes: {
    attached() {
      this.setDateinitialSelections();
      this.setPhotoCreationTime(getIndicesFromDate(getCurrentTime()));
    }
  }
})