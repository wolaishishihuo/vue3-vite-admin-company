/**
 *  @rule 手机号
 */
export function checkPhoneNumber(rule: any, value: any, callback: any) {
  const regexp = /^(((13\d)|(15\d)|(16\d)|(17[3-8])|(18\d)|(19\d)|(14[5-7]))+\d{8})$/;
  if (value === '') callback('请输入手机号码');
  if (!regexp.test(value)) {
    callback(new Error('请输入正确的手机号码'));
  } else {
    return callback();
  }
}

/**
 *  @rule 邮箱
 */
export function checkEmail(rule: any, value: any, callback: any) {
  const regexp = /^[\w.-]+@[a-z0-9-]+(\.[a-z0-9-]+)*\.[a-z0-9]{2,6}$/i;
  if (value === '') callback('请输入邮箱!');

  if (!regexp.test(value)) {
    callback(new Error('请输入正确的邮箱格式'));
  } else {
    return callback();
  }
}
