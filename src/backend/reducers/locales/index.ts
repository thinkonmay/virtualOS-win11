import { Translation } from '../globals';

export type Languages = 'VN' | 'ENG' | 'ID';
export enum Contents {
    PAYMENT_FOLLOW_UP_TITLE,
    PAYMENT_FOLLOW_UP_TITLE1,
    PAYMENT_FOLLOW_UP_CONTENT,
    PAYMENT_FOLLOW_UP_DONE,

    BOOTING,
    ROTATE_PHONE,

    ABOUT_OPENSOURCE,
    ABOUT_NOTMICROSOFT,
    ABOUT_CREATIVE,
    ABOUT_TITLE,
    ABOUT_LICENSED,
    ABOUT_ALSONOT,
    ABOUT_MICROSOFTCOPYWRITE,
    ABOUT_UNDERSTAND,
    ABOUT_CONTACT,

    STORE_FEATURED_APP,
    STORE_FEATURED_APP_INFOR,
    STORE_FEATURED_GAME,
    STORE_FEATURED_GAME_INFO,

    STORE_FREE,
    STORE_OWNED,
    STORE_RENT,
    STORE_FEATURES,
    STORE_RATINGSR,
    STORE_DESCRIPTIONR,

    CAMERA_TAKE_PHOTOR,
    KNOW_THINKMAY_VIA,
    GETSTARTED_COUNTRY,
    GETSTARTED_ANOTHERKEYBOARDR,
    MY_FRIEND,
    OTHER_SOURCE,

    TEST,
    SUGGEST,
    UNSPECIFIC,
    ALREADY_DEPLOYED,
    NOT_ALLOW,
    RUN_OUT_OF_GPU_STOCK,
    RUN_OUT_OF_GPU_STOCK_NOTIFY,
    NOT_READY,
    NOT_RUNNING,
    NOT_PAUSED,
    PAUSED,
    NOT_PINGED,
    REMOTE_TIMEOUT,
    UNKNOWN_ERROR,
    IS_LOCKED,
    NOT_FOUND,
    TIME_OUT,
    STARTAPP,
    INSTALLAPP,
    PAUSEAPP,
    THANKS,
    THANKPARAPHRASE,
    LA,
    WITHOUTACC,
    CLOSEDEMO,
    PLAN_NAME,
    STARTAT,
    ENDAT,
    TIME,
    INACTIVEUSER,
    APP_NOT_AVAILABLE,
    GUIDELINE,
    PENDING,
    SUCCESS,
    REJECTED,
    FETCH_APP,
    INSTALL_APP,
    DEMO_APP,
    START_APP,
    PAUSE_APP,
    DELETE_APP,
    RESET_APP,
    ACCESS_APP,
    WELCOME_LINE1,
    WELCOME_LINE2,
    WELCOME_LINE3,
    WELCOME_LINE4,
    HAVE_ACCOUNT,
    SIGN_IN,

    DEVICE_YOU_PLAY,
    DEVICE_PC,
    DEVICE_LAPTOP,
    DEVICE_MACBOOK,
    DEVICE_CHROMEBOOK,
    DEVICE_IPHONE,
    DEVICE_ANDROID,
    DEVICE_TV,

    WHAT_LOOK_FOR,
    COMFORTABLE,
    HARDCORE,
    PROFESSIONAL,
    EXPLORE,
    DONT_KNOW,

    BEST_EXP,
    HEADER_1,
    HEADER_2,
    CONTENT_1,
    CONTENT_2,
    CONTENT_3,
    CONTENT_4,
    CONTENT_5,
    CONTENT_6,
    CONTENT_7,
    CONTENT_8,
    SURVEY_COMPLETED,
    FAIL_DEMO_REGION,
    FAIL_DEMO_TEMP,
    DEMO,
    SUPPORT,
    BOOKING_DEMO,
    DEMO_SUGGESSTION,
    EXPLORE_WEB,
    SETTING,
    LOW_PERIOD,
    VIDEO_TOGGLE,
    RESET_VIDEO,
    HOMESCREEN,
    FULLSCREEN,
    RELATIVE_MOUSE,
    RELATIVE_MOUSE_EXPLAIN,
    SCAN_CODE,
    SCAN_CODE_EXPLAIN,
    HIDE_VM,
    HIDE_VM_EXPLAIN,
    STRICT_TIMING,
    EXTERNAL_TAB,
    EXTERNAL_TAB_EXPlAIN,
    QUALITY,
    FRAMERATE,
    DEMO_TUTORIAL_HEAD,
    DEMO_TUTORIAL_1,
    DEMO_TUTORIAL_2,
    DEMO_TUTORIAL_3,
    DEMO_TUTORIAL_4,
    DEMO_TUTORIAL_5,

    START_DEMO,
    READ_USER_MANUAL,
    PRO_TIP_DEMO_0,
    PRO_TIP_DEMO_1,
    PRO_TIP_DEMO_2,
    PRO_TIP_DEMO_3,
    FB_TERRIBLE,
    FB_BAD,
    FB_GOOD,
    FB_AMAZING,
    FB_CONTROL,
    FB_KEYBOARD,
    FB_MOUSE,
    FB_GAMEPAD,
    FB_TOUCH,
    FB_CONNECT,
    FB_BLACKSCREEN,
    FB_LAG,
    FB_NOSHOWVIDEO,
    FB_GAME,
    FB_OTHER,
    FB_ISSUE,
    FB_SUBMIT,
    FB_DETAIL,
    DEMO_QUEUED,
    DEMO_NOTE,
    ALREADY_DEMO,
    THINKMAY_HEADER,
    THINKMAY_DESC,
    PLAN_USAGE_TIME,
    ADDITIONAL_TIME,
    SHUT_DOWN,
    OPEN_GAMEPAD,
    OPEN_KEYBOARD,
    ADJUST_GAMEPAD,
    SUGGEST_BITRATE_FPS,
    SUGGEST_BROWSER,

    MAXIMUM_QUALITY,
    MAXIMUM_QUALITY_EXPLAIN,
    DEBUGGER,
    DEBUGGER_EXPLAIN,
    GUIDELINE_APP,
    PAYMENT_APP,
    TEMPLATE_APP,
    CONNECT_APP,
    WORKER_APP,
    DISCORD_APP,
    FANPAGE_APP,
    //CONNECT APP ( CA )
    CA_TURN_ON_PC,
    CA_CONNECT,
    CA_INITIALIZING,
    CA_RELOAD_TRY_AGAIN,
    // HANG CHO

    CA_FIRST_QUEUED,
    CA_POS_QUEUED_FRIST,
    CA_POS_QUEUED_LAST,
    CA_CONNECT_NOTIFY,

    //TEMPLATE APP (TA)

    TA_TILE,
    TA_SUBTITLE,
    TA_CRATE_NEW_PC,
    TA_CRATE_NEW_PC_NOTIFY,
    TA_POPUP_TITLE,
    TA_POPUP_SUBTITLE,
    TA_POPUP_CLOSE,
    TA_POPUP_CONTINUE,

    TA_PAYMENT,
    TA_PAYMENT_DESC,

    //listQA

    QA_CLOUDPC,
    QA_INSTALLGAMES,
    QA_CONNECTGEARS,
    QA_FIXLAG,

    WIN_D_SHORTCUT
}

export function language() {
    const t: Translation = new Map<Languages, Map<Contents, string>>();
    const vn = new Map<Contents, string>();
    t.set('VN', vn);
    const en = new Map<Contents, string>();
    const id = new Map<Contents, string>();
    t.set('ENG', en);
    t.set('ID', id);

    //QA

    //CA
    en.set(Contents.QA_CLOUDPC, 'What is CloudPC?');
    vn.set(Contents.QA_CLOUDPC, 'CloudPC là gì?');
    id.set(Contents.QA_CLOUDPC, 'What is CloudPC?');

    //CA
    en.set(Contents.QA_CONNECTGEARS, 'Connect Gears');
    vn.set(Contents.QA_CONNECTGEARS, 'Kết nối tay cầm & phím chuột?');
    id.set(Contents.QA_CONNECTGEARS, 'Connect Gears');

    //CA
    en.set(Contents.QA_INSTALLGAMES, 'How to install games?');
    vn.set(Contents.QA_INSTALLGAMES, 'Hướng dẫn cài game');
    id.set(Contents.QA_INSTALLGAMES, 'How to install games?');

    //CA
    en.set(Contents.QA_FIXLAG, 'How to reduce lagging?');
    vn.set(Contents.QA_FIXLAG, 'Cách giảm giật/lag');
    id.set(Contents.QA_FIXLAG, 'How to reduce lagging?');

    en.set(Contents.MAXIMUM_QUALITY, 'Maximum quality');
    vn.set(Contents.MAXIMUM_QUALITY, 'Chất lượng tối đa');
    id.set(Contents.MAXIMUM_QUALITY, 'Kualitas maksimal');

    en.set(Contents.MAXIMUM_QUALITY_EXPLAIN, 'Maximum quality');
    vn.set(
        Contents.MAXIMUM_QUALITY_EXPLAIN,
        'Bật để có thể tăng gấp đôi bitrate hiện tại'
    );
    id.set(Contents.MAXIMUM_QUALITY_EXPLAIN, 'Kualitas maksimal');

    en.set(Contents.DEBUGGER, 'Debugger');
    vn.set(Contents.DEBUGGER, 'Copy lỗi');
    id.set(Contents.DEBUGGER, 'Debugger');

    en.set(Contents.DEBUGGER_EXPLAIN, 'Debugger');
    vn.set(
        Contents.DEBUGGER_EXPLAIN,
        'Bấm đề copy lỗi vào bộ nhớ tạm, dán & gửi cho admin để được hỗ trợ!'
    );
    id.set(Contents.DEBUGGER_EXPLAIN, 'Debugger');

    en.set(Contents.CA_TURN_ON_PC, 'Turn on PC');
    vn.set(Contents.CA_TURN_ON_PC, 'Bật máy');
    id.set(Contents.CA_TURN_ON_PC, 'Hidupkan PC');

    en.set(Contents.CA_CONNECT, 'Connect');
    vn.set(Contents.CA_CONNECT, 'Kết nối');
    id.set(Contents.CA_CONNECT, 'Sambungkan');

    en.set(Contents.CA_INITIALIZING, 'Your PC is initializing');
    vn.set(Contents.CA_INITIALIZING, 'Máy đang được khởi tạo');
    id.set(Contents.CA_INITIALIZING, 'PC Anda sedang menginisialisasi');

    en.set(
        Contents.CA_RELOAD_TRY_AGAIN,
        'Please wait in 5 minutes & try later'
    );
    vn.set(Contents.CA_RELOAD_TRY_AGAIN, 'Reload và thử lại sau 5 phút');
    id.set(Contents.CA_RELOAD_TRY_AGAIN, 'Tunggu 5 menit & coba lagi');

    en.set(
        Contents.CA_FIRST_QUEUED,
        'You are first in line in the queue, please keep the tab open!'
    );
    vn.set(
        Contents.CA_FIRST_QUEUED,
        'Bạn đang ở vị trí đầu tiên trong hàng chờ, vui lòng giữ tab!'
    );
    id.set(
        Contents.CA_FIRST_QUEUED,
        'Anda berada di urutan pertama dalam antrean, harap tetap buka tab!'
    );

    en.set(Contents.CA_POS_QUEUED_FRIST, 'You are currently');
    vn.set(Contents.CA_POS_QUEUED_FRIST, 'Bạn đang ở vị trí thứ');
    id.set(Contents.CA_POS_QUEUED_FRIST, 'Anda saat ini berada di posisi');

    en.set(
        Contents.CA_POS_QUEUED_LAST,
        ' in the queue, please keep the tab open!'
    );
    vn.set(Contents.CA_POS_QUEUED_LAST, ' trong hàng chờ, vui lòng giữ tab!');
    id.set(
        Contents.CA_POS_QUEUED_LAST,
        ' dalam antrean, harap tetap buka tab!'
    );

    en.set(
        Contents.CA_CONNECT_NOTIFY,
        'If the wait exceeds 4 minutes, please reload and reconnect.'
    );
    vn.set(
        Contents.CA_CONNECT_NOTIFY,
        ' Nếu đợi quá 4 phút, hãy reload & kết nối lại.'
    );
    id.set(
        Contents.CA_CONNECT_NOTIFY,
        'Jika menunggu lebih dari 4 menit, silakan muat ulang & sambungkan kembali.'
    );

    en.set(
        Contents.TA_TILE,
        'A new machine has been pre-created with the game already installed.'
    );
    vn.set(Contents.TA_TILE, 'Tạo sẵn máy mới đã được tải sẵn game');
    id.set(
        Contents.TA_TILE,
        'Sebuah mesin baru telah dibuat sebelumnya dengan game sudah terinstal.'
    );

    en.set(
        Contents.TA_SUBTITLE,
        'Please note that the game account is not included.'
    );
    vn.set(Contents.TA_SUBTITLE, 'Lưu ý không kèm theo tài khoản game');
    id.set(
        Contents.TA_SUBTITLE,
        'Perhatikan bahwa akun game tidak disertakan.'
    );
    en.set(Contents.TA_CRATE_NEW_PC, 'Create new PC');
    vn.set(Contents.TA_CRATE_NEW_PC, 'Tạo máy mới');
    id.set(Contents.TA_CRATE_NEW_PC, 'Buat PC baru');

    en.set(
        Contents.TA_CRATE_NEW_PC_NOTIFY,
        'Creating a new machine will delete the existing data on the old one. Please make sure to provide a clear reminder before clicking.'
    );
    vn.set(
        Contents.TA_CRATE_NEW_PC_NOTIFY,
        'Tạo máy sẽ xoá dữ liệu hiện có trên máy cũ, dữ liệu không thể lấy lại. Vui lòng cân nhắc.'
    );
    id.set(
        Contents.TA_CRATE_NEW_PC_NOTIFY,
        'Membuat mesin baru akan menghapus data yang ada di mesin lama. Pastikan memberi peringatan jelas sebelum mengklik.'
    );

    en.set(Contents.TA_POPUP_TITLE, 'Are you sure?');
    vn.set(Contents.TA_POPUP_TITLE, 'Bạn có chắc?');
    id.set(Contents.TA_POPUP_TITLE, 'Apakah Anda yakin?');

    en.set(
        Contents.TA_POPUP_SUBTITLE,
        'Creating a new machine will delete the existing data on the old one.'
    );
    vn.set(
        Contents.TA_POPUP_SUBTITLE,
        'Tạo máy sẽ xoá dữ liệu hiện có trên máy cũ'
    );
    id.set(
        Contents.TA_POPUP_SUBTITLE,
        'Membuat mesin baru akan menghapus data yang ada di mesin lama.'
    );

    en.set(Contents.TA_POPUP_CLOSE, 'Close');
    vn.set(Contents.TA_POPUP_CLOSE, 'Đóng');
    id.set(Contents.TA_POPUP_CLOSE, 'Tutup');

    en.set(Contents.TA_POPUP_CONTINUE, 'Continue');
    vn.set(Contents.TA_POPUP_CONTINUE, 'Tiếp tục');
    id.set(Contents.TA_POPUP_CONTINUE, 'Lanjutkan');

    en.set(Contents.TA_PAYMENT, 'Payment');
    vn.set(Contents.TA_PAYMENT, 'Thanh toán');
    id.set(Contents.TA_PAYMENT, 'Payment');

    en.set(
        Contents.TA_PAYMENT_DESC,
        'You need to subscribe to Thinkmay before installation'
    );
    vn.set(
        Contents.TA_PAYMENT_DESC,
        'Bạn cần thanh toán dịch vụ trước khi cài đặt game'
    );
    id.set(
        Contents.TA_PAYMENT_DESC,
        'You need to subscribe to Thinkmay before installation'
    );

    en.set(Contents.PAYMENT_APP, 'Payment');
    vn.set(Contents.PAYMENT_APP, 'Thanh toán');
    id.set(Contents.PAYMENT_APP, 'Pembayaran');

    en.set(Contents.GUIDELINE_APP, 'Guideline');
    vn.set(Contents.GUIDELINE_APP, 'Hướng dẫn');
    id.set(Contents.GUIDELINE_APP, 'Panduan');

    en.set(Contents.TEMPLATE_APP, 'Template');
    vn.set(Contents.TEMPLATE_APP, 'Template');
    id.set(Contents.TEMPLATE_APP, 'Template');

    en.set(Contents.CONNECT_APP, 'Connect to YourPC');
    vn.set(Contents.CONNECT_APP, 'Máy tính cá nhân');
    id.set(Contents.CONNECT_APP, 'Sambungkan ke PC Anda');

    en.set(Contents.WORKER_APP, 'Worker');
    vn.set(Contents.WORKER_APP, 'Worker');
    id.set(Contents.WORKER_APP, 'Pekerja');

    en.set(Contents.FANPAGE_APP, 'Fanpage');
    vn.set(Contents.FANPAGE_APP, 'Fanpage');
    id.set(Contents.FANPAGE_APP, 'Halaman penggemar');

    en.set(Contents.DISCORD_APP, 'Discord');
    vn.set(Contents.DISCORD_APP, 'Discord');
    id.set(Contents.DISCORD_APP, 'Discord');

    en.set(Contents.BOOTING, 'Your device is booting');
    vn.set(Contents.BOOTING, 'Thinkmay đang khởi động, bạn đợi chút nhé');
    id.set(
        Contents.BOOTING,
        'Perangkat Anda sedang menyala, harap tunggu sebentar'
    );

    en.set(
        Contents.ROTATE_PHONE,
        'Please rotate your phone horizontally to continue'
    );
    vn.set(
        Contents.ROTATE_PHONE,
        'Hãy xoay ngang màn hình để tiếp tục sử dụng'
    );
    id.set(
        Contents.ROTATE_PHONE,
        'Silakan putar ponsel Anda secara horizontal untuk melanjutkan'
    );

    en.set(Contents.STORE_OWNED, 'Owned');
    vn.set(Contents.STORE_OWNED, 'Owned');
    id.set(Contents.STORE_OWNED, 'Dimiliki');

    en.set(Contents.WIN_D_SHORTCUT, 'Homescreen');
    vn.set(Contents.WIN_D_SHORTCUT, 'Về màn hình Window');
    id.set(Contents.WIN_D_SHORTCUT, 'Homescreen');

    en.set(Contents.STORE_RENT, 'Rent');
    vn.set(Contents.STORE_RENT, 'Rent');
    id.set(Contents.STORE_RENT, 'Sewa');

    en.set(Contents.STORE_FEATURES, 'Features');
    vn.set(Contents.STORE_FEATURES, 'Features');
    id.set(Contents.STORE_FEATURES, 'Fitur');

    en.set(Contents.STORE_RATINGSR, 'Ratings and reviews');
    vn.set(Contents.STORE_RATINGSR, 'Ratings and reviews');
    id.set(Contents.STORE_RATINGSR, 'Penilaian dan ulasan');

    en.set(Contents.STORE_DESCRIPTIONR, 'Description');
    vn.set(Contents.STORE_DESCRIPTIONR, 'Description');
    id.set(Contents.STORE_DESCRIPTIONR, 'Deskripsi');

    en.set(Contents.CAMERA_TAKE_PHOTOR, 'Take photo');
    vn.set(Contents.CAMERA_TAKE_PHOTOR, 'Take photo');
    id.set(Contents.CAMERA_TAKE_PHOTOR, 'Ambil foto');

    en.set(Contents.TEST, 'English');
    vn.set(Contents.TEST, 'Vietnamese');
    id.set(Contents.TEST, 'Bahasa Indonesia');

    en.set(
        Contents.SUGGEST,
        'Please reload and try it again, in a few minutes'
    );
    vn.set(Contents.SUGGEST, 'Vui lòng thử lại sau ít phút');
    id.set(
        Contents.SUGGEST,
        'Silakan muat ulang dan coba lagi dalam beberapa menit'
    );

    en.set(Contents.UNSPECIFIC, 'Something went wrong.');
    vn.set(Contents.UNSPECIFIC, 'Something went wrong.');
    id.set(Contents.UNSPECIFIC, 'Terjadi kesalahan.');

    en.set(Contents.RUN_OUT_OF_GPU_STOCK, 'We are running out of computer!');
    vn.set(
        Contents.RUN_OUT_OF_GPU_STOCK,
        'Chúng mình hiện tại đang tạm hết máy, bạn đợi thêm nhé!'
    );
    id.set(
        Contents.RUN_OUT_OF_GPU_STOCK,
        'Kami kehabisan komputer saat ini, mohon tunggu sebentar!'
    );

    en.set(
        Contents.RUN_OUT_OF_GPU_STOCK_NOTIFY,
        'We are running out of computer. Please hold tab, it will notify & connect when free'
    );
    vn.set(
        Contents.RUN_OUT_OF_GPU_STOCK_NOTIFY,
        'Hệ thống đang hết máy, sẽ tự động kết nối & thông báo khi có máy trống. Vui lòng giữ tab!'
    );
    id.set(
        Contents.RUN_OUT_OF_GPU_STOCK_NOTIFY,
        'Kami kehabisan komputer. Mohon tetap buka tab, sistem akan memberi notifikasi & menghubungkan saat tersedia.'
    );

    en.set(
        Contents.REMOTE_TIMEOUT,
        'Remote request timed out, could you try to reset the app?'
    );
    vn.set(
        Contents.REMOTE_TIMEOUT,
        'Yêu cầu kết nối hết hạn, bạn thử bật lại máy nhé!'
    );
    id.set(
        Contents.REMOTE_TIMEOUT,
        'Permintaan jarak jauh melebihi batas waktu, coba reset aplikasinya.'
    );

    en.set(Contents.UNKNOWN_ERROR, 'Unknown error happened');
    vn.set(Contents.UNKNOWN_ERROR, 'Lỗi không xác định đã xảy ra');
    id.set(Contents.UNKNOWN_ERROR, 'Terjadi kesalahan yang tidak diketahui');

    en.set(
        Contents.IS_LOCKED,
        'Your data is uploading to cloud, please wait a few minutes'
    );
    vn.set(
        Contents.IS_LOCKED,
        'Đang trong quá trình upload data lên cloud, quá trình này diễn ra trong ~15 phút !'
    );
    id.set(
        Contents.IS_LOCKED,
        'Data Anda sedang diunggah ke cloud, harap tunggu beberapa menit.'
    );

    en.set(Contents.NOT_FOUND, 'Resources not found!');
    vn.set(Contents.NOT_FOUND, 'Không tìm thấy app yêu cầu.');
    id.set(Contents.NOT_FOUND, 'Sumber daya tidak ditemukan!');

    en.set(Contents.TIME_OUT, 'Installing timeout!');
    vn.set(
        Contents.TIME_OUT,
        "Yêu cầu đã hết hạn. KHÔNG gửi lại yêu cầu để tránh lỗi data. RELOAD lại sau mỗi 1-2' cho đến khi game lên. Nếu quá 10' hãy báo lỗi cho page."
    );
    id.set(
        Contents.TIME_OUT,
        'Batas waktu instalasi telah habis. Jangan kirim ulang permintaan untuk menghindari kesalahan data. Muat ulang setiap 1-2 menit hingga game aktif. Jika lebih dari 10 menit, laporkan ke halaman dukungan.'
    );

    en.set(Contents.PLAN_NAME, 'Package');
    vn.set(Contents.PLAN_NAME, 'Gói');
    id.set(Contents.PLAN_NAME, 'Paket');

    en.set(Contents.STARTAT, 'Start at');
    vn.set(Contents.STARTAT, 'Ngày bắt đầu');
    id.set(Contents.STARTAT, 'Mulai pada');

    en.set(Contents.ENDAT, 'End');
    vn.set(Contents.ENDAT, 'Ngày hết hạn');
    id.set(Contents.ENDAT, 'Berakhir pada');

    en.set(Contents.TIME, 'Total usage');
    vn.set(Contents.TIME, 'Số giờ chơi');
    id.set(Contents.TIME, 'Total penggunaan');

    en.set(Contents.GUIDELINE, 'Guideline');
    vn.set(Contents.GUIDELINE, 'Hướng dẫn');
    id.set(Contents.GUIDELINE, 'Panduan');

    en.set(Contents.SIGN_IN, 'Sign In');
    vn.set(Contents.SIGN_IN, 'Đăng nhập');
    id.set(Contents.SIGN_IN, 'Masuk');

    en.set(Contents.SUPPORT, 'Support now!');
    vn.set(Contents.SUPPORT, 'Hỗ trợ ngay!');
    id.set(Contents.SUPPORT, 'Dapatkan bantuan sekarang!');

    en.set(Contents.SETTING, 'Setting');
    vn.set(Contents.SETTING, 'Cài đặt');
    id.set(Contents.SETTING, 'Pengaturan');

    en.set(Contents.VIDEO_TOGGLE, 'Show/Hide Video');
    vn.set(Contents.VIDEO_TOGGLE, 'Ẩn/ hiện remote');
    id.set(Contents.VIDEO_TOGGLE, 'Tampilkan/Sembunyikan Video');

    en.set(Contents.RESET_VIDEO, 'Reset Video');
    vn.set(Contents.RESET_VIDEO, 'Reset đường truyền');
    id.set(Contents.RESET_VIDEO, 'Setel ulang Video');

    en.set(Contents.HOMESCREEN, 'Hide windows');
    vn.set(Contents.HOMESCREEN, 'Ẩn game/app');
    id.set(Contents.HOMESCREEN, 'Sembunyikan jendela');

    en.set(Contents.LOW_PERIOD, 'Auto refresh');
    vn.set(Contents.LOW_PERIOD, 'Làm mới liên tục');
    id.set(Contents.LOW_PERIOD, 'Pembaruan otomatis');

    en.set(Contents.FULLSCREEN, 'Fullscreen');
    vn.set(Contents.FULLSCREEN, 'Toàn màn hình');
    id.set(Contents.FULLSCREEN, 'Layar penuh');

    en.set(Contents.RELATIVE_MOUSE, 'Gaming mode');
    vn.set(Contents.RELATIVE_MOUSE, 'Chế độ gaming');
    id.set(Contents.RELATIVE_MOUSE, 'Mode gaming');

    en.set(Contents.HIDE_VM, 'Online game');
    vn.set(Contents.HIDE_VM, 'Online game');
    id.set(Contents.HIDE_VM, 'Online game');

    en.set(Contents.HIDE_VM_EXPLAIN, 'Enable for online games like FC Online');
    vn.set(
        Contents.HIDE_VM_EXPLAIN,
        'Bật khi bạn chơi những game online như FC Online'
    );
    id.set(Contents.HIDE_VM_EXPLAIN, 'Enable for online games like FC Online');

    en.set(Contents.SCAN_CODE, 'Fix keyboard');
    vn.set(Contents.SCAN_CODE, 'Fix lỗi phím');
    id.set(Contents.SCAN_CODE, 'Perbaiki keyboard');

    en.set(Contents.SCAN_CODE_EXPLAIN, 'Fix keyboard');
    vn.set(
        Contents.SCAN_CODE_EXPLAIN,
        'Bật khi 1 số game không bấm được phím như: GTA 5, FCO, DMC5, vv'
    );
    id.set(Contents.SCAN_CODE_EXPLAIN, 'Perbaiki keyboard');

    en.set(Contents.STRICT_TIMING, 'Bad network mode');
    vn.set(Contents.STRICT_TIMING, 'Chế độ sóng yếu');
    id.set(Contents.STRICT_TIMING, 'Mode jaringan buruk');

    en.set(Contents.FRAMERATE, 'FPS');
    vn.set(Contents.FRAMERATE, 'FPS: Số khung hình hiển thị/ giây');
    id.set(Contents.FRAMERATE, 'FPS: Jumlah frame per detik');

    en.set(Contents.START_DEMO, 'Start Demo');
    vn.set(Contents.START_DEMO, 'Bắt Đầu');
    id.set(Contents.START_DEMO, 'Mulai Demo');

    en.set(Contents.READ_USER_MANUAL, 'Will start in ');
    vn.set(Contents.READ_USER_MANUAL, 'Sẽ bắt đầu sau ');
    id.set(Contents.READ_USER_MANUAL, 'Akan dimulai dalam ');

    en.set(
        Contents.PRO_TIP_DEMO_0,
        'Click "Fix keyboard if you can not move when playing game'
    );
    vn.set(
        Contents.PRO_TIP_DEMO_0,
        'Click "Fix bàn phím" nếu không di chuyển được khi chơi game'
    );
    id.set(
        Contents.PRO_TIP_DEMO_0,
        'Klik "Perbaiki keyboard" jika tidak bisa bergerak saat bermain game'
    );

    en.set(Contents.PRO_TIP_DEMO_1, 'Open settings in the lower right corner');
    vn.set(Contents.PRO_TIP_DEMO_1, 'Mở "Setting" góc dưới bên phải');
    id.set(Contents.PRO_TIP_DEMO_1, 'Buka "Pengaturan" di sudut kanan bawah');

    en.set(Contents.PRO_TIP_DEMO_2, 'Full screen when playing games');
    vn.set(Contents.PRO_TIP_DEMO_2, 'Nên bật "Toàn màn hình" khi chơi game');
    id.set(Contents.PRO_TIP_DEMO_2, 'Gunakan "Layar penuh" saat bermain game');

    en.set(
        Contents.PRO_TIP_DEMO_3,
        'Click "Support now" to receive the earliest technical support'
    );
    vn.set(
        Contents.PRO_TIP_DEMO_3,
        'Click "Hỗ trợ ngay" để được hỗ trợ kỹ thuật sớm nhất.'
    );
    id.set(
        Contents.PRO_TIP_DEMO_3,
        'Klik "Dapatkan bantuan sekarang" untuk mendapatkan dukungan teknis secepatnya.'
    );

    // FEEDBACK
    en.set(Contents.PLAN_USAGE_TIME, 'Plan usage time');
    vn.set(Contents.PLAN_USAGE_TIME, 'Thời gian của gói');
    id.set(Contents.PLAN_USAGE_TIME, 'Waktu penggunaan paket');

    en.set(Contents.ADDITIONAL_TIME, 'Additional time');
    vn.set(Contents.ADDITIONAL_TIME, 'Thời gian cộng thêm');
    id.set(Contents.ADDITIONAL_TIME, 'Waktu tambahan');

    en.set(Contents.SHUT_DOWN, 'Shut down');
    vn.set(Contents.SHUT_DOWN, 'Tắt máy');
    id.set(Contents.SHUT_DOWN, 'Matikan');

    en.set(Contents.OPEN_GAMEPAD, 'Gamepad');
    vn.set(Contents.OPEN_GAMEPAD, 'Gamepad');
    id.set(Contents.OPEN_GAMEPAD, 'Gamepad');

    en.set(Contents.OPEN_KEYBOARD, 'KeyBoard');
    vn.set(Contents.OPEN_KEYBOARD, 'KeyBoard');
    id.set(Contents.OPEN_KEYBOARD, 'Papan Ketik');

    en.set(Contents.ADJUST_GAMEPAD, 'Gamepad Setting');
    vn.set(Contents.ADJUST_GAMEPAD, 'Chỉnh Gamepad');
    id.set(Contents.ADJUST_GAMEPAD, 'Pengaturan Gamepad');

    en.set(Contents.SUGGEST_BITRATE_FPS, 'BITRATE & FPSsuggest');
    vn.set(Contents.SUGGEST_BITRATE_FPS, 'BITRATE & FPS khuyến nghị');
    id.set(Contents.SUGGEST_BITRATE_FPS, 'Saran BITRATE & FPS');

    en.set(Contents.SUGGEST_BROWSER, 'HAVE TO: connect through Chrome or App');
    vn.set(Contents.SUGGEST_BROWSER, 'BẮT BUỘC: phải mở trên Chrome hoặc App');
    id.set(
        Contents.SUGGEST_BROWSER,
        'HARUS: buka melalui Chrome atau Aplikasi'
    );

    en.set(Contents.PLAN_NAME, 'Package');
    vn.set(Contents.PLAN_NAME, 'Gói');
    id.set(Contents.PLAN_NAME, 'Paket');

    en.set(Contents.STARTAT, 'Start at');
    vn.set(Contents.STARTAT, 'Ngày bắt đầu');
    id.set(Contents.STARTAT, 'Mulai pada');

    en.set(Contents.ENDAT, 'End');
    vn.set(Contents.ENDAT, 'Ngày hết hạn');
    id.set(Contents.ENDAT, 'Berakhir pada');

    en.set(Contents.TIME, 'Total usage');
    vn.set(Contents.TIME, 'Số giờ chơi');
    id.set(Contents.TIME, 'Total penggunaan');

    en.set(Contents.SIGN_IN, 'Sign In');
    vn.set(Contents.SIGN_IN, 'Đăng nhập');
    id.set(Contents.SIGN_IN, 'Masuk');

    en.set(Contents.SUPPORT, 'Support now!');
    vn.set(Contents.SUPPORT, 'Hỗ trợ ngay!');
    id.set(Contents.SUPPORT, 'Dukung sekarang!');

    en.set(Contents.SETTING, 'Setting');
    vn.set(Contents.SETTING, 'Cài đặt');
    id.set(Contents.SETTING, 'Pengaturan');

    en.set(Contents.VIDEO_TOGGLE, 'Show/Hide Video');
    vn.set(Contents.VIDEO_TOGGLE, 'Ẩn/ hiện remote');
    id.set(Contents.VIDEO_TOGGLE, 'Show/Hide Video');

    en.set(Contents.RESET_VIDEO, 'Reset Video');
    vn.set(Contents.RESET_VIDEO, 'Reset đường truyền');
    id.set(Contents.RESET_VIDEO, 'Atur Ulang Video');

    en.set(Contents.HOMESCREEN, 'Hide windows');
    vn.set(Contents.HOMESCREEN, 'Ẩn game/app');
    id.set(Contents.HOMESCREEN, 'Sembunyikan jendela');

    en.set(Contents.LOW_PERIOD, 'Auto refresh');
    vn.set(Contents.LOW_PERIOD, 'Làm mới liên tục');
    id.set(Contents.LOW_PERIOD, 'Penyegaran otomatis');

    en.set(Contents.FULLSCREEN, 'Fullscreen');
    vn.set(Contents.FULLSCREEN, 'Toàn màn hình');
    id.set(Contents.FULLSCREEN, 'Layar penuh');

    en.set(Contents.RELATIVE_MOUSE, 'Gaming mode');
    vn.set(Contents.RELATIVE_MOUSE, 'Chế độ gaming');
    id.set(Contents.RELATIVE_MOUSE, 'Mode bermain');

    en.set(Contents.RELATIVE_MOUSE_EXPLAIN, 'Gaming mode');
    vn.set(Contents.RELATIVE_MOUSE_EXPLAIN, 'Bật để khoá chuột khi chơi game');
    id.set(Contents.RELATIVE_MOUSE_EXPLAIN, 'Mode bermain');

    en.set(Contents.STRICT_TIMING, 'Bad network mode');
    vn.set(Contents.STRICT_TIMING, 'Chế độ sóng yếu');
    id.set(Contents.STRICT_TIMING, 'Mode jaringan buruk');

    en.set(Contents.EXTERNAL_TAB, 'Share link');
    vn.set(Contents.EXTERNAL_TAB, 'Chia sẻ link');
    id.set(Contents.EXTERNAL_TAB, 'Bagikan tautan');

    en.set(Contents.EXTERNAL_TAB_EXPlAIN, 'Share link');
    vn.set(
        Contents.EXTERNAL_TAB_EXPlAIN,
        'Tạo link & gửi cho bạn bè để chơi chung'
    );
    id.set(Contents.EXTERNAL_TAB_EXPlAIN, 'Bagikan tautan');

    en.set(Contents.QUALITY, 'Quality');
    vn.set(Contents.QUALITY, 'MBps: Chất lượng video -> tốc độ mạng');
    id.set(Contents.QUALITY, 'Kualitas');

    en.set(Contents.FRAMERATE, 'FPS');
    vn.set(Contents.FRAMERATE, 'FPS: Số khung hình hiển thị/ giây');
    id.set(Contents.FRAMERATE, 'FPS');

    // Connecta App

    return t;
}
