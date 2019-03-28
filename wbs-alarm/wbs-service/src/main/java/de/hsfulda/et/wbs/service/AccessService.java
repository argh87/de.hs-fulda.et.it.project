package de.hsfulda.et.wbs.service;

import de.hsfulda.et.wbs.core.ResourceNotFoundException;
import de.hsfulda.et.wbs.core.WbsUser;
import de.hsfulda.et.wbs.repository.AccessRepository;
import org.springframework.stereotype.Service;

import java.util.function.Supplier;

@Service
public class AccessService {

    private final AccessRepository repo;

    public AccessService(AccessRepository repo) {
        this.repo = repo;
    }

    public <T> T hasAccessOnBenutzer(
            final WbsUser user, final Long benutzerId, final Supplier<T> supplier) {

        Long counts = repo.findTraegerByUserAndBenutzerId(user.getId(), benutzerId);
        return evaluteCount(counts, supplier);
    }

    public <T> T hasAccessOnZielort(
            final WbsUser user, final Long zielortId, final Supplier<T> supplier) {

        Long counts = repo.findTraegerByUserAndZielortId(user.getId(), zielortId);
        return evaluteCount(counts, supplier);
    }

    public <T> T hasAccessOnTraeger(
            final WbsUser user, final Long traegerId, final Supplier<T> supplier) {

        Long counts = repo.findTraegerByUserAndTraegerId(user.getId(), traegerId);
        return evaluteCount(counts, supplier);
    }

    public <T> T hasAccessOnKategorie(
            final WbsUser user, final Long kategorieId, final Supplier<T> supplier) {

        Long counts = repo.findTraegerByUserAndKategorieId(user.getId(), kategorieId);
        return evaluteCount(counts, supplier);
    }

    public <T> T hasAccessOnGroesse(
            final WbsUser user, final Long groesseId, final Supplier<T> supplier) {
        Long counts = repo.findTraegerByUserAndGroesseId(user.getId(), groesseId);
        return evaluteCount(counts, supplier);
    }


    public <T> T hasAccessOnBestand(final WbsUser user, final Long bestandId, final Supplier<T> supplier) {
        Long counts = repo.findTraegerByUserAndBestandId(user.getId(), bestandId);
        return evaluteCount(counts, supplier);
    }

    private <T> T evaluteCount(
            final Long counts, final Supplier<T> supplier) {

        if (counts > 0) {
            return supplier.get();
        }
        throw new ResourceNotFoundException();
    }
}
