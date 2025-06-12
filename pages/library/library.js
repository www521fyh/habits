Page({
    data: {
        habitTemplates: [
            {
                id: 1,
                name: '每天喝水2000ml',
                icon: '/pages/images/water.png',
                frequency: '每天',
                added: false
            },
            {
                id: 2,
                name: '跑步20分钟',
                icon: '/pages/images/running.png',
                frequency: '每周3次',
                added: false
            },
            {
                id: 3,
                name: '阅读20分钟',
                icon: '/pages/images/reading.png',
                frequency: '每天',
                added: false
            },
            {
                id: 4,
                name: '晚上11点前睡觉',
                icon: '/pages/images/sleep.png',
                frequency: '每天',
                added: false
            },
            {
                id: 5,
                name: '吃一个水果',
                icon: '/pages/images/fruit.png',
                frequency: '每天',
                added: false
            }
        ]
    },

    onShow: function () {
        this.checkAndResetWeekProgress();
        this.checkAddedHabits();
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
                ...habitTemplate,
                completed: false,
                weekProgress: habitTemplate.frequency === '每天' ? '0/7' : '0/3',
                added: true
            };
            wx.setStorageSync('habits', [...userHabits, newHabit]);
        }

        this.checkAddedHabits();
    }
}); 