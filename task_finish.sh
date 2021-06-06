## 把pt_pin的提取出来形成数组pt_pin
gen_pt_pin_array

## 把失效Cookie的pt_pin的编号提取出来形成数组invalid_ck_num
## log_path由主程序定义好了，task_finish.sh由主程序调用，因此直接使用
invalid_ck_count=$(grep -c "cookie已失效" $log_path)
invalid_ck_num=()
[[ $invalid_ck_count -ge 1 ]] && {
    invalid_ck_pin=( $(grep -E "开始【京东账号|cookie已失效" $log_path | grep -B1 "cookie已失效" | grep "开始【京东账号" | perl -pe "s|.+】([^\*]+).*|\1|") )
    for ((i=0; i<${#invalid_ck_pin[*]}; i++)); do
        for ((j=0; j<${#pt_pin[*]}; j++)); do
            [[ ${invalid_ck_pin[i]} == ${pt_pin[j]} ]] && {
                invalid_ck_num+=( $(($j + 1)) )
                continue 2
            }
        done
    done
}

## 增补TempBlockCookie，必须根据自己TempBlockCookie有用的那一行的特征作定制化修改
## 千万不要完全照搬，照搬会把你的config.sh改错，这也是为什么无法直接将此功能在jtask中集成的原因
## file_config_user在主程序中已经定义好了，指用户的config.sh文件
[[ ${#invalid_ck_num[*]} -ge 1 ]] && {
    echo -e "检测到这些编号的Cookie已失效：${invalid_ck_num[@]}，自动在 $file_config_user 中屏蔽掉..."
    for ((m=0; m<${#invalid_ck_num[*]}; m++)); do
        [[ -z $(grep -E "^TempBlockCookie=.*( |\")${invalid_ck_num[m]}( |\")" $file_config_user) ]] && perl -i -pe "s|^(TempBlockCookie=.*)(\")$|\1 ${invalid_ck_num[m]}\2|" $file_config_user
    done
} || echo -e "没有Cookie失效...\n"

## 提供一个我用来屏蔽账号的TempBlockCookie的参考
# # 先定义某些账号不跑某些脚本
# case $1 in
#     jd_bookshop)
#         TempBlockCookie="3 6 10 11"
#         ;;
#     *_fruit)
#         TempBlockCookie="4 8 10"
#         ;;
#     jd_jdfactory)
#         TempBlockCookie="3 7 9"
#         ;;
#     jd_beauty | jd_bean_home | jd_family | jd_global_mh | jd_ms | jd_health*)
#         TempBlockCookie="3 10"
#         ;;
#     jd_family)
#         TempBlockCookie="3"
#         ;;
#     jd_daily_egg)
#         TempBlockCookie="3 6 8 10"
#         ;;
#     jd_moneyTree | jd_small_home)
#         TempBlockCookie="10"
#         ;;
#     jd_pigPet)
#         TempBlockCookie="2 4 5 6 10"
#         ;;
#     jd_dreamFactory)
#         TempBlockCookie="4 7 8 9 10 11"
#         ;;
#     *_pet)
#         TempBlockCookie="4 8 10"
#         ;;
# esac

# # 再基于已经生成的TempBlockCookie额外附加失效Cookie编号
# TempBlockCookie="$TempBlockCookie 3 5"

## 在跑完jd_bean_change任务后，立即运行一次jcsv
[[ $file_name == jd_bean_change ]] && {
    echo -e "开始记录豆豆变化情况...\n"
    $cmd_jcsv
}
