// 将剩余毫秒数拆分为天/时/分/秒
function pad(n) {
  return n < 10 ? '0' + n : String(n);
}

function splitRemaining(ms) {
  const total = Math.max(0, Math.floor(ms / 1000));
  return {
    done: total === 0,
    days: Math.floor(total / 86400),
    hours: pad(Math.floor((total % 86400) / 3600)),
    minutes: pad(Math.floor((total % 3600) / 60)),
    seconds: pad(total % 60)
  };
}

module.exports = { splitRemaining };
