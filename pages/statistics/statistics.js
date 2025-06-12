Page({
    data: {
        completedHabits: 0,
        totalCheckins: 0,
        maxStreak: 1,
        habits: []
    },

    onShow: function () {
        this.loadStatistics();
    },

    loadStatistics: function () {
        const habits = wx.getStorageSync('habits') || [];

        // 计算总体统计数据
        const completedHabits = habits.filter(h => h.completion >= 100).length;
        const totalCheckins = habits.reduce((sum, h) => sum + (h.totalCheckins || 0), 0);
        const maxStreak = Math.max(...habits.map(h => h.currentStreak || 0), 0);

        // 为每个习惯添加统计数据
        const habitsWithStats = habits.map(habit => ({
            ...habit,
            totalCheckins: habit.totalCheckins || 0,
            currentStreak: habit.currentStreak || 0,
            completion: habit.completion || 0
        }));

        this.setData({
            completedHabits,
            totalCheckins,
            maxStreak,
            habits: habitsWithStats
        });
    }
}); 