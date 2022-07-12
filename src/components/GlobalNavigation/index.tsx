/**
 * 全局导航组件的内容
 * @constructor
 */
import {Input, notification, Tag} from 'antd';
import './index.less';
import {useState,useEffect} from "react";
import {deepQuery} from "@/utils/menu";

const PREFIX = 'global-nav';


const GlobalNavigation = ({menuData}: any) => {
    const [matchedMenu,setMatchedMenu]=useState<any[]>([]);

    useEffect(()=>{
        handleSearchMenu(null);
    },[menuData])

    const handleSearchMenu=(value:string|null)=>{
        const a = deepQuery(menuData,value===''?null:value);
        setMatchedMenu(a);
    }

    const hasMatchedMenu = (child:any)=>{
        let match = false;
        matchedMenu.forEach(value=>{
            if(value.key===child.key){
                match = true;
            }
        })
        return match;
    }

    return (
        <div className={`${PREFIX}-container`}>
            <div className={`${PREFIX}-header`}>
                <div>
                    <Input.Group compact>
                        <Input.Search
                            placeholder="输入菜单名称快速查找"
                            allowClear
                            style={{ width: '50%' }}
                            onSearch={handleSearchMenu}
                        />
                    </Input.Group>
                </div>
                <div className={`${PREFIX}-recent-open`}>
                    <em>最近访问：</em>
                    <span>用户管理</span>
                    <span>用户管理</span>
                    <span>基础表单</span>
                </div>
            </div>
            <div className={`${PREFIX}-content`}>
                {(menuData||[]).map((item: any)=>{
                    return (
                        <div className={`${PREFIX}-menu-group`} key={item.key}>
                            <h4>{item.label}</h4>
                            {
                                (item.children||[]).map((child:any)=>{
                                    return <p key={child.key} className={hasMatchedMenu(child)?'match':''}>{child.label}</p>
                                })
                            }
                        </div>
                    )
                })}
            </div>
        </div>
    );
};

export default GlobalNavigation;
