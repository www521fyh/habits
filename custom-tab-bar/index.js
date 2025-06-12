Component({
    data: {
        selected: 0,
        color: "#999999",
        selectedColor: "#7B66FF",
        list: [
            {
                pagePath: "/pages/habits/habits",
                text: "我的习惯"
            },
            {
                pagePath: "/pages/library/library",
                text: "习惯库"
            },
            {
                pagePath: "/pages/statistics/statistics",
                text: "统计"
            }
        ]
    },
    methods: {
        switchTab(e) {
            const data = e.currentTarget.dataset;
            const url = data.path;
            wx.switchTab({
                url
            });
            this.setData({
                selected: data.index
            });
        }
    }
}); 