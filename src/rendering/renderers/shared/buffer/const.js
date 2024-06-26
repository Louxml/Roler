

// 缓冲区使用标识，用 "|" 组合使用
export const BufferUsage = {
    
    /**
     * TODO可映射缓冲区进行读取，只能与COPY_DST进行组合使用
     */
    MAP_READ: 0x0001,

    /**
     * TODO可映射缓冲区进行写入，只能与COPY_SRC进行组合使用
     *
    MAP_WRITE: 0x0002,

    /**
     * TODO可拷贝到其他缓冲区
     */
    COPY_SRC: 0x0004,

    /**
     * TODO可被拷贝或被写入的目标缓冲区
     */
    COPY_DST: 0x0008,

    /**
     * 可被用于索引缓冲区
     */
    INDEX: 0x0010,

    /**
     * 可被用于顶点缓冲区
     */
    VERTEX: 0x0020,

    /**
     * 可被用于Uniform缓冲区
     */
    UNIFORM: 0x0040,

    /**
     * 可被用于存储缓冲区
     */
    STORAFE: 0x0080,

    /**
     * 可被用于存储间接命令参数的缓冲区
     */
    INDIRECT: 0x0100,

    /**
     * 可被用于查询结果的缓冲区
     */
    QUERY_RESOLVE: 0x0200,

    /**
     * 静态缓冲区，不会频繁更新
     */
    STATIC: 0x0400,
}