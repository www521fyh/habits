Page({
    data: {
        habitTemplates: [
            {
                id: 1,
                name: '每天喝水2000ml',
                icon: 'images/water.png',
                frequency: '每天',
                added: false
            },
            {
                id: 2,
                name: '跑步20分钟',
                icon: 'images/running.png',
                frequency: '每周3次',
                added: false
            },
            {
                id: 3,
                name: '阅读20分钟',
                icon: 'images/reading.png',
                frequency: '每天',
                added: false
            },
            {
                id: 4,
                name: '晚上11点前睡觉',
                icon: 'images/sleep.png',
                frequency: '每天',
                added: false
            },
            {
                id: 5,
                name: '吃一个水果',
                icon: 'images/fruit.png',
                frequency: '每天',
                added: false
            }
        ]
    },

    onShow: function () {
        this.checkAddedHabits();

        // 更新tabBar选中状态
        if (typeof this.getTabBar === 'function' && this.getTabBar()) {
            this.getTabBar().setData({
                selected: 1
            });
        }
    },

    checkAddedHabits: function () {
        const userHabits = wx.getStorageSync('habits') || [];
        const habitTemplates = this.data.habitTemplates.map(template => ({
            ...template,
            added: userHabits.some(h => h.id === template.id)
        }));

        this.setData({ habitTemplates });
    },

    toggleHabit: function (e) {
        const habitId = e.currentTarget.dataset.id;
        const userHabits = wx.getStorageSync('habits') || [];
        const habitTemplate = this.data.habitTemplates.find(h => h.id === habitId);

        if (habitTemplate.added) {
            // Remove habit
            const newHabits = userHabits.filter(h => h.id !== habitId);
            wx.setStorageSync('habits', newHabits);
        } else {
            // Add habit
            const newHabit = {
                id: habitTemplate.id,
                name: habitTemplate.name,
                icon: habitTemplate.icon,
                frequency: habitTemplate.frequency,
                completed: false,
                weekProgress: habitTemplate.frequency === '每天' ? '0/7' : '0/3',
                added: true,
                checkInRecords: [],
                weekStartDate: new Date().setHours(0, 0, 0, 0)
            };
            // 将新习惯添加到数组末尾
            wx.setStorageSync('habits', [...userHabits, newHabit]);
        }

        this.checkAddedHabits();
    }
}); 