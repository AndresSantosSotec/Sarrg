import { StyleSheet, Platform } from 'react-native';


export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc'
    },
    header: {
        backgroundColor: '#3b82f6',
        paddingVertical: 16,
        paddingHorizontal: 20,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOpacity: 0.1,
                shadowOffset: { width: 0, height: 2 },
                shadowRadius: 8
            },
            android: {
                elevation: 4
            }
        })
    },
    changeBtn: {
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    changeBtnText: {
        color: 'white',
        marginLeft: 4,
        fontSize: 12,
        fontWeight: '600',
    },
    //nuevos estilos actualizados 
    // … tus estilos existentes …
    photoButtonsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 12,
    },
    photoButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 12,
    },
    photoBtn: {
        backgroundColor: '#3b82f6',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderRadius: 8,
    },
    photoBtnText: {
        color: 'white',
        marginLeft: 6,
        fontWeight: '600',
    },
    previewImage: {
        width: '100%',
        height: 200,
        borderRadius: 12,
        marginTop: 10,
    },
    //fin nuevos estils

    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        color: 'white',
        fontSize: 20,
        fontWeight: '700',
        marginLeft: 8,
    },
    scroll: {
        padding: 16,
        paddingBottom: 150
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOpacity: 0.05,
                shadowOffset: { width: 0, height: 4 },
                shadowRadius: 12,
            },
            android: {
                elevation: 3,
            },
        }),
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1e293b',
        marginLeft: 8,
    },
    photoContainer: {
        alignItems: 'center',
        marginBottom: 12,
    },
    photoWrapper: {
        position: 'relative',
        borderRadius: 16,
        overflow: 'hidden',
        alignSelf: 'center',    // <— aquí
        marginBottom: 12,
    },
    photo: {
        width: 200,
        height: 200,
        borderRadius: 16,
    },
    photoOverlay: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.4)',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        padding: 8,
    },
    removeBtn: {
        backgroundColor: 'rgba(220, 38, 38, 0.8)',
        borderRadius: 12,
        padding: 4,
    },
    photoOverlayText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '500',
        marginLeft: 4,
    },
    photoPlaceholder: {
        width: 200,
        height: 200,
        borderRadius: 16,
        backgroundColor: '#f1f5f9',
        borderWidth: 2,
        borderColor: '#e2e8f0',
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center', 
        marginBottom: 12,
    },
    photoPlaceholderText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#475569',
        marginTop: 12,
        textAlign: 'center',
    },
    photoPlaceholderSubtext: {
        fontSize: 14,
        color: '#94a3b8',
        marginTop: 4,
    },
    inputGroup: {
        marginBottom: 20
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#334155',
        marginBottom: 8,
    },
    customSelector: {
        backgroundColor: '#f8fafc',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        padding: 16,
    },
    selectorContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    selectorLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    selectorText: {
        fontSize: 16,
        color: '#1e293b',
        marginLeft: 12,
        fontWeight: '500',
    },
    intensityDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    textInput: {
        backgroundColor: '#f8fafc',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        fontSize: 16,
        color: '#1e293b',
    },
    durationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    durationInput: {
        flex: 2,
        textAlign: 'center',
    },
    unitSelector: {
        flex: 3,
        backgroundColor: '#f8fafc',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    unitText: {
        fontSize: 16,
        color: '#1e293b',
        fontWeight: '500',
    },
    caloriesContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fef3c7',
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
    },
    caloriesIcon: {
        marginRight: 12,
    },
    caloriesLabel: {
        fontSize: 14,
        color: '#92400e',
        fontWeight: '500',
    },
    caloriesValue: {
        fontSize: 20,
        color: '#92400e',
        fontWeight: '700',
    },
    notesInput: {
        height: 100,
        textAlignVertical: 'top',
    },
    locationButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#eff6ff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
    },
    locationButtonText: {
        fontSize: 16,
        color: '#3b82f6',
        fontWeight: '500',
        marginLeft: 8,
    },
    locationInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0fdf4',
        borderRadius: 8,
        padding: 12,
    },
    locationText: {
        fontSize: 14,
        color: '#166534',
        marginLeft: 6,
        flex: 1,
    },
    saveButton: {
        backgroundColor: '#3b82f6',
        borderRadius: 16,
        padding: 18,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 6,
        marginBottom: 20,
        ...Platform.select({
            ios: {
                shadowColor: '#3b82f6',
                shadowOpacity: 0.3,
                shadowOffset: { width: 0, height: 4 },
                shadowRadius: 12,
            },
            android: {
                elevation: 6,
            },
        }),
    },
    saveButtonDisabled: {
        backgroundColor: '#94a3b8',
    },
    saveButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '700',
        marginLeft: 8,
    },

    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingTop: 24,
        maxHeight: '70%',
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1e293b',
    },
    modalScroll: {
        paddingHorizontal: 24,
    },
    modalOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderRadius: 12,
        marginVertical: 4,
    },
    modalOptionUnit: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginVertical: 4,
    },
    modalOptionSelected: {
        backgroundColor: '#eff6ff',
    },
    intensityInfo: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'center',
    },
    intensityDescription: {
        fontSize: 13,
        color: '#64748b',
        marginTop: 2,
    },
    caloriesSubtext: {
        fontSize: 13,
        color: '#64748b',
        marginTop: 2,
    },
    modalOptionText: {
        fontSize: 16,
        color: '#1e293b',
        fontWeight: '500',
        flex: 1,
    },
    modalOptionTextUnit: {
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '500',
    flex: 1,
    textAlign: 'center',
    },
    modalOptionTextSelected: {
        color: '#3b82f6',
        fontWeight: '700',
    },
    searchInput: {
        backgroundColor: '#f1f5f9',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        paddingHorizontal: 16,
        paddingVertical: 10,
        fontSize: 16,
        marginHorizontal: 24,
        marginBottom: 12,
    },
});