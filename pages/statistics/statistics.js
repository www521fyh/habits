Page({
    data: {
        completedHabits: 0,
        totalCheckins: 0,
        maxStreak: 1,
        habits: []
    },

    onShow: function () {
        this.loadStatistics();

        // 更新tabBar选中状态
        if (typeof this.getTabBar === 'function' && this.getTabBar()) {
            this.getTabBar().setData({
                selected: 2
            });
        }
    },

    loadStatistics: function () {
        const habits = wx.getStorageSync('habits') || [];

        // 为每个习惯添加正确的图标路径
        const habitsWithStats = habits.map(habit => {
            // 确保图标路径正确
            const icon = habit.icon.startsWith('/') ? habit.icon : '/images/' + habit.icon;

            return {
                ...habit,
                icon: icon,  // 使用处理后的图标路径
                totalCheckins: habit.totalCheckins || 0,
                currentStreak: habit.currentStreak || 0,
                completion: habit.completion || 0
            };
        });

        this.setData({
            completedHabits: habits.filter(h => h.completion >= 100).length,
            totalCheckins: habits.reduce((sum, h) => sum + (h.totalCheckins || 0), 0),
            maxStreak: Math.max(...habits.map(h => h.currentStreak || 0), 0),
            habits: habitsWithStats
        });
    }
}); 