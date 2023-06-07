const Moment = require('moment');
const formatTime = (time) => {
    return Moment(time).format('YYYY-MM-DD')
}
/**获取上一天日期 */
const formatBeforetTime = (time) => {
    return Moment().subtract(1, 'day').format('YYYY-MM-DD')

}
module.exports = {
    formatTime,
    formatBeforetTime
}