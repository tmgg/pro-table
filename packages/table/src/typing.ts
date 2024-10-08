﻿import type { SizeType } from 'antd/lib/config-provider/SizeContext';
import type { LabelTooltipType } from 'antd/lib/form/FormItemLabel';
import type { NamePath } from 'antd/lib/form/interface';
import type { SearchProps } from 'antd/lib/input';
import type { SpinProps } from 'antd/lib/spin';
import type { TableProps } from 'antd/lib/table';
import type { ColumnFilterItem, ColumnType, CompareFn, SortOrder } from 'antd/lib/table/interface';
import type React from 'react';
import type { CSSProperties } from 'react';
import type { OptionConfig, ToolBarProps } from './components/ToolBar';
import type { DensitySize } from './components/ToolBar/DensityIcon';
import type { ColumnsState } from './container';
import type { FormInstance } from 'antd';
import {ProSchema, ProSchemaComponentTypes} from "./proutils/typing";

export type PageInfo = {
  pageSize: number;
  total: number;
  current: number;
};

export type RequestData<T> = {
  data: T[] | undefined;
  success?: boolean;
  total?: number;
} & Record<string, any>;

export type UseFetchDataAction<T = any> = {
  dataSource: T[];
  setDataSource: (dataSource: T[]) => void;
  loading: boolean | SpinProps | undefined;
  pageInfo: PageInfo;
  reload: () => Promise<void>;
  reset: () => void;
  pollingLoading: boolean;
  setPageInfo: (pageInfo: Partial<PageInfo>) => void;
};

export type TableRowSelection = TableProps<any>['rowSelection'];

export type ExtraProColumnType<T> = Omit<
  ColumnType<T>,
  'render' | 'children' | 'title' | 'filters' | 'onFilter' | 'sorter'
> & {
  sorter?:
    | string
    | boolean
    | CompareFn<T>
    | {
        compare?: CompareFn<T>;
        /** Config multiple sorter order priority */
        multiple?: number;
      };
};

export type ProColumnType<T = unknown, ValueType = 'text'> = ProSchema<
  T,
  ExtraProColumnType<T> & {
    index?: number;
    /**
     * 每个表单占据的格子大小
     *
     * @param 总宽度 = span* colSize
     * @param 默认为 1
     */
    colSize?: number;

    /** 搜索表单的默认值 */
    initialValue?: any;


    /** @deprecated Use `search=false` instead 在查询表单中隐藏 */
    hideInSearch?: boolean;



    /** @name 在 table 中隐藏 */
    hideInTable?: boolean;


    /** @name 不在配置工具中显示 */
    hideInSetting?: boolean;

    /** @name 表头的筛选菜单项 */
    filters?: boolean | ColumnFilterItem[];

    /** @name 筛选的函数，设置为 false 会关闭自带的本地筛选 */
    onFilter?: boolean | ColumnType<T>['onFilter'];

    /** @name Form 的排序 */
    order?: number;



    /** @private */
    listKey?: string;

    /** @name 只读 */
    readonly?: boolean;
  },
  ProSchemaComponentTypes,
  ValueType
>;

export type ProColumnGroupType<RecordType, ValueType> = {
  children: ProColumns<RecordType>[];
} & ProColumnType<RecordType, ValueType>;

export type ProColumns<T = any, ValueType = 'text'> =
  | ProColumnGroupType<T, ValueType>
  | ProColumnType<T, ValueType>;
export type ColumnsStateType = {
  /**
   * 持久化的类型，支持 localStorage 和 sessionStorage
   *
   * @param localStorage 设置在关闭浏览器后也是存在的
   * @param sessionStorage 关闭浏览器后会丢失
   */
  persistenceType?: 'localStorage' | 'sessionStorage';
  /** 持久化的key，用于存储到 storage 中 */
  persistenceKey?: string;
  /** ColumnsState 的值，columnsStateMap将会废弃 */
  defaultValue?: Record<string, ColumnsState>;
  /** ColumnsState 的值，columnsStateMap将会废弃 */
  value?: Record<string, ColumnsState>;
  onChange?: (map: Record<string, ColumnsState>) => void;
};

/** ProTable 的类型定义 继承自 antd 的 Table */
export type ProTableProps<T, U, ValueType = 'text'> = {
  /**
   * 是否显示搜索框
   */
  search?: boolean;

  /**
   * @name 列配置能力，支持一个数组
   */
  columns?: ProColumns<T, ValueType>[];



  /**
   * request 的参数，修改之后会触发更新
   *
   * @example pathname 修改重新触发 request
   * params={{ pathName }}
   */
  params?: U;

  /**
   * 列状态配置，可以配置是否浮动和是否展示
   *
   * @deprecated 请使用 columnsState.value 代替
   */
  columnsStateMap?: Record<string, ColumnsState>;
  /**
   * 列状态配置修改触发事件
   *
   * @deprecated 请使用 columnsState.onChange 代替
   */
  onColumnsStateChange?: (map: Record<string, ColumnsState>) => void;

  /** @name 列状态的配置，可以用来操作列功能 */
  columnsState?: ColumnsStateType;

  onSizeChange?: (size: DensitySize) => void;

  /**
   * @name 渲染 table
   */
  tableRender?: (
    props: ProTableProps<T, U, ValueType>,
    defaultDom: JSX.Element,
    /** 各个区域的 dom */
    domList: {
      toolbar: JSX.Element | undefined;
      table: JSX.Element | undefined;
    },
  ) => React.ReactNode;

  /**
   * @name 渲染 table 视图，用于定制 ProList，不推荐直接使用
   */
  tableViewRender?: (props: TableProps<T>, defaultDom: JSX.Element) => JSX.Element | undefined;

  /** @name 一个获得 dataSource 的方法 */
  request: (
    params: U & {
      pageSize?: number;
      current?: number;
      keyword?: string;
    },
    sort: Record<string, SortOrder>,
    filter: Record<string, React.ReactText[] | null>,
  ) => Promise<Partial<RequestData<T>>>;

  /** @name 对数据进行一些处理 */
  postData?: (data: any[]) => any[];
  /** @name 默认的数据 */
  defaultData?: T[];

  /**
   * @name 初始化的参数，可以操作 table
   *
   * @example 重新刷新表格
   * actionRef.current?.reload();
   *
   * @example 重置表格
   * actionRef.current?.reset();
   */
  actionRef?: React.Ref<ActionType | undefined>;

  /**
   * @name 操作自带的 form
   */
  formRef?: React.RefObject<FormInstance>;
  /**
   * @name 渲染操作栏
   */
  toolBarRender?: ToolBarProps<T>['toolBarRender'] | false;

  /**
   * @name 数据加载完成后触发
   */
  onLoad?: (dataSource: T[]) => void;

  /**
   * @name loading 被修改时触发，一般是网络请求导致的
   */
  onLoadingChange?: (loading: boolean | SpinProps | undefined) => void;

  /**
   * @name 数据加载失败时触发
   */
  onRequestError?: (e: Error) => void;

  /**
   * 是否轮询 ProTable 它不会自动提交表单，如果你想自动提交表单的功能，需要在 onValueChange 中调用 formRef.current?.submit()
   *
   * @param dataSource 返回当前的表单数据，你可以用它判断要不要打开轮询
   */
  polling?: number | ((dataSource: T[]) => number);

  /** @name 给封装的 table 的 className */
  tableClassName?: string;

  /** @name 给封装的 table 的 style */
  tableStyle?: CSSProperties;

  /** @name 左上角的 title */
  headerTitle?: React.ReactNode;

  /** @name 标题旁边的 tooltip */
  tooltip?: string | LabelTooltipType;

  /** @name 操作栏配置 */
  options?: OptionConfig | false;

  /**
   * 基本配置与 antd Form 相同, 但是劫持了 form onFinish 的配置
   *
   */
  form?: FormInstance;

  /** @name 格式化搜索表单提交数据 */
  beforeSearchSubmit?: (params: Partial<U>) => any;

  /** @name 选择项配置 */
  rowSelection?: TableProps<T>['rowSelection'] | false;

  style?: React.CSSProperties;

  /**  提交表单时触发 */
  onSubmit?: (params: U) => void;

  /** @name 重置表单时触发 */
  onReset?: () => void;

  /**
   * @name 可编辑表格修改数据的改变
   */
  onDataSourceChange?: (dataSource: T[]) => void;

  /** @name 去抖时间 */
  debounceTime?: number;
  /**
   * 只在request 存在的时候生效，可编辑表格也不会生效
   *
   * @default true
   * @name 窗口聚焦时自动重新请求
   */
  revalidateOnFocus?: boolean;
  /** 默认的表格大小 */
  defaultSize?: SizeType;
  /**
   * @name, 可编辑表格的name,通过这个name 可以直接与 form通信，无需嵌套
   */
  name?: NamePath;
  /**
   * 错误边界自定义
   */
  ErrorBoundary?: any;
} & Omit<TableProps<T>, 'columns' | 'rowSelection'>;

/**
 * 替代：ProCoreActionType， 去掉了编辑相关的属性
 */
declare type ProCoreActionTypeWithoutEdit<T = {}> = {
  /** @name 刷新 */
  reload: (resetPageIndex?: boolean) => Promise<void>;
  /** @name 刷新并清空，只清空页面，不包括表单 */
  reloadAndRest?: () => Promise<void>;
  /** @name 重置任何输入项，包括表单 */
  reset?: () => void;
  /** @name 清空选择 */
  clearSelected?: () => void;
  /** @name p页面的信息都在里面 */
  pageInfo?: PageInfo;
} & T;

export type ActionType = ProCoreActionTypeWithoutEdit & {
  setPageInfo?: (page: Partial<PageInfo>) => void;
};

export type UseFetchProps = {
  dataSource?: any;
  loading: UseFetchDataAction['loading'];
  onLoadingChange?: (loading: UseFetchDataAction['loading']) => void;
  onLoad?: (dataSource: any[], extra: any) => void;
  onDataSourceChange?: (dataSource?: any) => void;
  postData: any;
  pageInfo:
    | {
        current?: number;
        pageSize?: number;
        defaultCurrent?: number;
        defaultPageSize?: number;
      }
    | false;
  onPageInfoChange?: (pageInfo: PageInfo) => void;
  effects?: any[];
  onRequestError?: (e: Error) => void;
  manual: boolean;
  debounceTime?: number;
  polling?: number | ((dataSource: any[]) => number);
  revalidateOnFocus?: boolean;
};

export type OptionSearchProps = Omit<SearchProps, 'onSearch'> & {
  /** 如果 onSearch 返回一个false，直接拦截请求 */
  onSearch?: (keyword: string) => boolean | undefined;
};
