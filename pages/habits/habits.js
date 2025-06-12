Page({
    data: {
        currentDate: '',
        weekday: '',
        habits: [],
        completedCount: 0,
        totalCount: 0,
        // 对话框相关数据
        showDialog: false,
        newHabitName: '',
        frequency: '每天',
        selectedTimes: 1
    },

    onLoad: function () {
        this.setDateInfo();
        this.loadHabits();
    },

    onShow: function () {
        this.checkAndResetWeekProgress();
        this.loadHabits();

        // 更新tabBar选中状态
        if (typeof this.getTabBar === 'function' && this.getTabBar()) {
            this.getTabBar().setData({
                selected: 0
            });
        }
    },

    setDateInfo: function () {
        const now = new Date();
        const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

        this.setData({
            currentDate: `${now.getMonth() + 1}.${now.getDate()}`,
            weekday: weekdays[now.getDay()]
        });
    },

    loadHabits: function () {
        const habits = wx.getStorageSync('habits') || [];
        const completedCount = habits.filter(h => h.completed).length;

        this.setData({
            habits,
            completedCount,
            totalCount: habits.length
        });
    },

    toggleHabit: function (e) {
        const habitId = e.currentTarget.dataset.id;
        const habits = wx.getStorageSync('habits') || [];
        const updatedHabits = habits.map(habit => {
            if (habit.id === habitId) {
                const isCompleted = !habit.completed;
                const [current, total] = habit.weekProgress.split('/').map(Number);
                const newCurrent = isCompleted ? current + 1 : current - 1;

                return {
                    ...habit,
                    completed: isCompleted,
                    weekProgress: `${newCurrent}/${total}`
                };
            }
            return habit;
        });

        wx.setStorageSync('habits', updatedHabits);
        this.loadHabits();
    },

    // 对话框相关方法
    openDialog: function () {
        this.setData({
            showDialog: true,
            newHabitName: '',
            frequency: '每天',
            selectedTimes: 1
        });
    },

    closeDialog: function () {
        this.setData({
            showDialog: false
        });
    },

    stopPropagation: function (e) {
        e.stopPropagation();
    },

    selectFrequency: function (e) {
        const freq = e.currentTarget.dataset.freq;
        this.setData({
            frequency: freq,
            // 切换频率时重置次数选择
            selectedTimes: 1
        });
    },

    selectTimes: function (e) {
        const times = e.currentTarget.dataset.times;
        this.setData({
            selectedTimes: times
        });
    },

    confirmAddHabit: function () {
        if (!this.data.newHabitName.trim()) {
            wx.showToast({
                title: '请输入习惯名称',
                icon: 'none'
            });
            return;
        }

        const habits = wx.getStorageSync('habits') || [];
        const newHabit = {
            id: Date.now(),
            name: this.data.newHabitName,
            icon: 'images/default.png',
            frequency: this.data.frequency === '每天' ? '每天' : `每周${this.data.selectedTimes}次`,
            completed: false,
            weekProgress: `0/${this.data.frequency === '每天' ? 7 : this.data.selectedTimes}`,
            added: true,
            checkInRecords: [],
            weekStartDate: this.getWeekStartDate()
        };

        // 将新习惯添加到数组末尾
        wx.setStorageSync('habits', [...habits, newHabit]);
        this.loadHabits();
        this.closeDialog();

        wx.showToast({
            title: '添加成功',
            icon: 'success'
        });
    },

    // 获取本周开始日期（周一）
    getWeekStartDate: function () {
        const now = new Date();
        const day = now.getDay() || 7; // 将周日的0转换为7
        const diff = day - 1; // 计算与周一的差值
        const monday = new Date(now);
        monday.setDate(now.getDate() - diff);
        monday.setHours(0, 0, 0, 0);
        return monday.getTime();
    },

    // 检查并重置周进度
    checkAndResetWeekProgress: function () {
        const habits = wx.getStorageSync('habits') || [];
        const now = new Date();
        const currentWeekStart = this.getWeekStartDate();

        const updatedHabits = habits.map(habit => {
            if (habit.weekStartDate < currentWeekStart) {
                // 如果习惯的周开始时间早于当前周的开始时间，重置进度
                const total = habit.frequency === '每天' ? 7 : Number(habit.frequency.match(/\d+/)[0]);
                return {
                    ...habit,
                    weekProgress: `0/${total}`,
                    completed: false,
                    weekStartDate: currentWeekStart,
                    checkInRecords: []
                };
            }
            return habit;
        });

        if (JSON.stringify(habits) !== JSON.stringify(updatedHabits)) {
            wx.setStorageSync('habits', updatedHabits);
            this.loadHabits();
        }
    }
}); 